import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService, Channel, ChannelService, Content, FilterBase, SearchBehavior } from '@picturepark/sdk-v1-angular';
import { take } from 'rxjs/operators';

@Component({
  template: `<pp-content-browser
    [channel]="selectedChannel"
    (previewItemChange)="openDetails($event)"
    (selectedItemsChange)="selectionChange($event)"
    (totalResultsChange)="resultsChange($event)"
  >
  </pp-content-browser>`,
})
export class ContentBrowserDemoComponent implements OnInit {
  @Input() public selectedFilter: FilterBase | null = null;
  @Input() public searchText = '';
  @Input() public searchBehavior: SearchBehavior;

  @Output() public previewItemChange = new EventEmitter<Content>();
  @Output() public selectedItemsChange = new EventEmitter<Content[]>();
  @Output() public totalResultsChange = new EventEmitter<number | null>();

  public selectedChannel: Channel;

  constructor(private authService: AuthService, private channelService: ChannelService) {}

  ngOnInit(): void {
    this.channelService
      .getAll()
      .pipe(take(1))
      .subscribe(
        (channels) => {
          this.selectedChannel = channels[0];
        },
        () => {
          console.log('channel service error');
        }
      );
  }

  public openDetails(item: Content) {
    this.previewItemChange.emit(item);
  }

  public selectionChange(items: Content[]): void {
    this.selectedItemsChange.emit(items);
  }

  public resultsChange(totalResults: number | null): void {
    this.totalResultsChange.emit(totalResults);
  }
}
