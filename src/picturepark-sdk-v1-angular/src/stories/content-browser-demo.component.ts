import { Component, Input, OnInit } from '@angular/core';
import { ChannelService, SearchBehavior, FilterBase, Channel, Content, AuthService } from '@picturepark/sdk-v1-angular';
import { take } from 'rxjs/operators';
import { ContentModel } from '@picturepark/sdk-v1-angular-ui';

@Component({
  template: `<pp-content-browser
    [channel]="selectedChannel"
    [filter]="selectedFilter"
    [searchString]="searchText"
    (previewItemChange)="openDetails($event)"
    (selectedItemsChange)="selectionChange($event)"
  >
  </pp-content-browser>`,
})
export class ContentBrowserDemoComponent implements OnInit {
  @Input() public selectedFilter: FilterBase | null = null;
  @Input() public searchText = '';
  @Input() public searchBehavior: SearchBehavior;

  selectedChannel: Channel;

  constructor(private authService: AuthService, private channelService: ChannelService) {}

  ngOnInit(): void {
    this.channelService
      .getAll()
      .pipe(take(1))
      .subscribe(
        (channels) => {
          // this.channels = channels;
          this.selectedChannel = channels[0];
          console.log('channel: ' + this.selectedChannel);
        },
        () => {
          // this.channels = [];
          console.log('channel service error');
          this.selectedChannel = JSON.parse(`{ "id": "rootChannel", "sortOrder": 0, "searchIndexId": "RootContentSearchIndex", "filter": null,
                "names": { "en": "Root Channel", "x-default": "Root Channel" }, "sort": [], "aggregations": [], "extendedSimpleSearchFields": [],
                "grantedUserRoleIds": [], "missingResultsDisplayPatterns": {}, "audit": { "creationDate": "2020-01-07T16:52:49.4559787Z",
                "modificationDate": "2020-01-07T16:52:49.4559787Z", "createdByUser": "6bf3ba9fefe44a3caa0b91a5ffde9f63",
                "modifiedByUser": "6bf3ba9fefe44a3caa0b91a5ffde9f63" }, "viewForAll": false }`) as Channel;
        }
      );
  }

  public openDetails(item: ContentModel<Content>) {
    // let index = this.contentBrowserComponent.items.indexOf(item);
    // this.dialog.open(ContentDetailsDialogComponent,
    //   {
    //     data: <ContentDetailDialogOptions>{
    //       id: item.item.id,
    //       showMetadata: true,
    //       hasPrevious: () => {
    //         return index !== 0;
    //       },
    //       hasNext: () => {
    //         return this.contentBrowserComponent.items.length > index + 1;
    //       },
    //       previous: () => {
    //         index--;
    //         return this.contentBrowserComponent.items[index].item.id;
    //       },
    //       next: () => {
    //         index++;
    //         return this.contentBrowserComponent.items[index].item.id;
    //       }
    //     },
    //     autoFocus: false,
    //     width: '980px',
    //     height: '700px'
    //   }
    // );
  }

  public selectionChange(items: Content[]): void {
    // this.selectedItems = items;
  }
}
