import { Component, OnInit, Inject, OnDestroy, Injector, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

// LIBRARIES
import {
  ContentDownloadLinkCreateRequest, ContentService, Content, Output as IOutPut,
  fetchAll, OutputRenderingState, OutputService, OutputSearchRequest, ContentResolveBehavior, ContentDetail
} from '@picturepark/sdk-v1-angular';

// COMPONENTS
import { DialogBaseComponent } from '../dialog-base/dialog-base.component';
import { OutputSelection } from './components/output-selection';

// SERVICES
import { TranslationService } from '../../../../shared-module/services/translations/translation.service';
import { groupBy, flatMap } from '../../../../utilities/helper';

@Component({
  selector: 'pp-content-download-dialog',
  templateUrl: './content-download-dialog.component.html',
  styleUrls: ['../dialog-base/dialog-base.component.scss', './content-download-dialog.component.scss']
})
export class ContentDownloadDialogComponent extends DialogBaseComponent implements OnInit, OnDestroy {

  @ViewChild('contentContainer', { static: true }) contentContainer: ElementRef;
  @ViewChild('loaderContainer', { static: true }) loaderContainer: ElementRef;

  // SUBSCRIBERS
  downloadContentSubscriber: Subscription;

  // VARS
  public selection: OutputSelection;
  public fileSize = 0;
  public enableAdvanced = false;
  public advancedMode = false;
  public filteredData: Content[];
  public noOutputs = false;
  public hasDynamicOutputs = false;

  public loader = false;

  public outputFormatFallback = [
    { fileSchemaId: 'ImageMetadata', outputFormatId: 'Preview' },
    { fileSchemaId: 'DocumentMetadata', outputFormatId: 'Pdf' },
    { fileSchemaId: 'AudioMetadata', outputFormatId: 'AudioSmall' },
    { fileSchemaId: 'VideoMetadata', outputFormatId: 'VideoLarge' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Content[],
    private contentService: ContentService,
    protected dialogRef: MatDialogRef<ContentDownloadDialogComponent>,
    private outputService: OutputService,
    protected injector: Injector,
    private renderer: Renderer2,
    private translationService: TranslationService,
  ) {
    super(data, dialogRef, injector);

    // DISPLAY LOADER
    this.loader = true;
  }

  async getSelection(outputs: IOutPut[], contents: Content[]) {

    const translations = await this.translationService.getOutputFormatTranslations();
    const selection = new OutputSelection(outputs, contents, translations, this.translationService);

    selection.getFileFormats().forEach(fileFormat => {
      const fileFormatOutputs = selection.getOutputs(fileFormat);
      const fileFormatContents = flatMap(fileFormatOutputs, i => i.values);
      if (fileFormat.contents.length === 0) {
          return;
      }

      const fallbackOutputs = fileFormat.contents
        .map(content => this.getOutput(
            content,
            fileFormatContents.filter(j => j.content.id === content.id).map(i => i.output))
        )
        .filter(i => i);

      if (fallbackOutputs.length === 0) {
          return;
      }

      const grouped = groupBy(fallbackOutputs, i => i.outputFormatId);
      fileFormatOutputs.forEach(output => {
          const fallback = grouped.get(output.id);
          if (!fallback) {
              return;
          }
          if (fallback && fallback.length === fileFormat.contents.length) {
              output.selected = true;
          }
      });
    });

    this.selection = selection;
    this.noOutputs = outputs.length === 0;
  }

  // DOWNLOAD SELECTED CONTENT
  public download(): void {

    const request = new ContentDownloadLinkCreateRequest({
      contents: this.selection.getSelectedOutputs().map(i => ({ contentId: i.contentId, outputFormatId: i.outputFormatId }))
    });
    const linkSubscription = this.contentService.createDownloadLink(request).subscribe(data => {
      linkSubscription.unsubscribe();
      if (data.downloadUrl) {
          window.location.replace(data.downloadUrl);
          this.dialogRef.close(true);
      }
    });

  }

  // TOGGLE ADVANCED
  public toggleAdvanced(): void {
    this.selection.toggleThumbnails();
    this.update();
  }

  // UPDATE
  public update(): void {
    this.enableAdvanced = this.selection.hasThumbnails;
    this.advancedMode = !this.selection.hasHiddenThumbnails;
    const outputs = this.selection.getSelectedOutputs();
    this.hasDynamicOutputs = outputs.some(i => i.dynamicRendering && !i.detail!.fileSizeInBytes);
    if (outputs.length > 0) {
      this.fileSize = outputs.map(i => i.detail!.fileSizeInBytes || 0).reduce((total, value) => total + value );
    } else {
      this.fileSize = 0;
    }
  }

  // GET OUTPUT
  public getOutput(content: Content, outputs: IOutPut[]): IOutPut {

    // Try to use Original
    let output = outputs.find(i => i.outputFormatId === 'Original');
    if (output) {
        return output;
    }

    // Fallback to configured output formats
    this.outputFormatFallback.filter(i => i.fileSchemaId === content.contentSchemaId).forEach(fallback => {
        output = outputs.find(i => i.outputFormatId === fallback.outputFormatId);
    });

    // If still no output, fallback to Preview
    if (!output) {
        output = outputs.find(i => i.outputFormatId === 'Preview');
    }

    return output!;
  }

  async ngOnInit() {

    super.ngOnInit();

    // SET LOADER HEIGHT DYNAMIC
    const containerHeight = this.contentContainer.nativeElement.offsetHeight;
    this.renderer.setStyle(this.loaderContainer.nativeElement, 'height', `${containerHeight + 56}px`);

    if (this.data.length === 1) {
      const detail = (this.data[0] as ContentDetail);
      if (detail.outputs) {
        this.setSelection(detail.outputs!);
        return;
      }

      const detailSubscription = this.contentService.get(this.data[0].id, [ContentResolveBehavior.Outputs]).subscribe(async content => {
        this.setSelection(content.outputs!);
      });
      this.subscription.add(detailSubscription);
    } else {
      const detail = (this.data[0] as ContentDetail);
      if (detail.outputs) {
        const outputs = flatMap(this.data, content => (content as ContentDetail).outputs!);
        this.setSelection(outputs);
        return;
      }

      this.fetchOutputs();
    }
  }

  private async setSelection(outputs: IOutPut[]): Promise<void> {
    await this.getSelection(outputs, this.data);
    this.update();
    this.loader = false;
  }

  private fetchOutputs(): void {
      const outputSubscription = fetchAll(req => this.outputService.search(req), new OutputSearchRequest({
          contentIds: this.data.map(i => i.id),
          renderingStates: [ OutputRenderingState.Completed ],
          limit: 1000
      })).subscribe(async outputs => {
        await this.getSelection(outputs.results, this.data);
        this.update();
        this.loader = false;
      });
      this.subscription.add(outputSubscription);
  }

}
