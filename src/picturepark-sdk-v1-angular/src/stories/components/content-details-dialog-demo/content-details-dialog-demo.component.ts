import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService, ShareContentDetail, ShareDetail } from '@picturepark/sdk-v1-angular';
import { ContentDetailDialogOptions, ContentDetailsDialogComponent } from '@picturepark/sdk-v1-angular-ui';

@Component({
  template: `<div style="margin: 10% 0">
    <button mat-raised-button (click)="openDetails($event)">Click me!</button>
  </div>`,
})
export class ContentDetailsDialogDemoComponent implements OnInit {
  @Input() public itemId: string;
  @Input() public shareContent: ShareContentDetail;
  @Input() public shareDetail: ShareDetail;

  // public selectedSchema: SchemaDetail;

  constructor(private authService: AuthService, private dialog: MatDialog) {}

  ngOnInit(): void {
    // this.schemaService.getMany(null).pipe(
    //     take(1),
    // ).subscribe(
    //     (channels) => {
    //         this.selectedSchema = channels[0];
    //     },
    //     () => {
    //         console.log('schema service error');
    //     });
  }

  public openDetails() {
    const json = `{
            audit": {
              "creationDate": "2020-01-20T15:10:56.675Z",
              "modificationDate": "2020-01-20T15:10:56.675Z",
              "createdByUser": "003f0458cc444bd59f41cdf104693207",
              "modifiedByUser": "003f0458cc444bd59f41cdf104693207"
            },
            "contentSchemaId": "ImageMetadata",
            "contentType": "Bitmap",
            "layerSchemaIds": [
              "ExifMetadata"
            ],
            "displayValues": {
              "thumbnail": "Private",
              "list": "2558x2600px - 9.1 MB - Colorspace: Rgb - DPI: 143.992599487304<br />
               - Creation date: 2020-01-20 15:10:56Z - Modification date: 2020-01-20 15:10:56Z",
              "detail": "home_page.png<br /><br />9.1 MB - Creation date: 20-Jan-2020 15:10:56 - Modification date: 20-Jan-2020 15:10:56",
              "name": "home_page.png - Creation date: 20-Jan-2020 15:10:56",
              "downloadFileName": "home_page.png"
            },
            "id": "a9e6c7db98944ff6a92c36404fa73859",
            "brokenReferenceIds": [],
            "brokenIndirectReferenceIds": [],
            "brokenRelationTargetIds": []
            }`;

    let index = 0;
    this.dialog.open(ContentDetailsDialogComponent, {
      data: <ContentDetailDialogOptions>{
        id: 'a9e6c7db98944ff6a92c36404fa73859',
        showMetadata: true,
        hasPrevious: () => {
          return index !== 0;
        },
        hasNext: () => {
          return 1 > index + 1;
        },
        //   previous: () => {
        //     index--;
        //     return this.contentBrowserComponent.items[index].item.id;
        //   },
        //   next: () => {
        //     index++;
        //     return this.contentBrowserComponent.items[index].item.id;
        //   }
      },
      autoFocus: false,
      width: '980px',
      height: '700px',
    });

    // let index = this.shareDetail.contentSelections.indexOf(this.shareContent);
    // this.dialog.open(ContentDetailsDialogComponent,
    //     {
    //         data: <ContentDetailDialogOptions>{
    //             id: this.itemId,
    //             shareContent: this.shareContent,
    //             shareDetail: this.shareDetail,
    //             showMetadata: false,
    //             hasPrevious: () => {
    //                 return index !== 0;
    //             },
    //             hasNext: () => {
    //                 return this.shareDetail.contentSelections.length > index + 1;
    //             },
    //             previous: () => {
    //                 index--;
    //                 return this.shareDetail.contentSelections[index];
    //             },
    //             next: () => {
    //                 index++;
    //                 return this.shareDetail.contentSelections[index];
    //             }
    //         },
    //         autoFocus: false,
    //         width: '980px',
    //         height: '700px',
    //         maxWidth: '98vw',
    //         maxHeight: '99vh'
    //     }
    // );
  }
}
