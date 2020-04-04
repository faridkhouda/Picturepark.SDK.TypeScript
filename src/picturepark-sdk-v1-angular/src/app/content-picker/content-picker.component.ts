import { Component, OnInit, OnDestroy, ViewChild, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

// LIBRARIES
import {
  AggregationResult,
  Channel,
  FilterBase,
  Content,
  AggregatorBase,
  ContentService,
  ContentAggregationRequest,
  LifeCycleFilter,
  ContentSearchType,
  BrokenDependenciesFilter,
  SearchBehavior,
  AggregationFilter,
} from '@picturepark/sdk-v1-angular';
import {
  SelectionService,
  BasketService,
  ContentModel,
  ContentBrowserComponent,
  SearchParameters,
  BaseComponent,
  ContentDetailDialogOptions,
} from '@picturepark/sdk-v1-angular-ui';

// COMPONENTS
import { ContentDetailsDialogComponent } from '@picturepark/sdk-v1-angular-ui';

// SERVICES
import { EmbedService } from './embed.service';

@Component({
  templateUrl: './content-picker.component.html',
  styleUrls: ['./content-picker.component.scss'],
})
export class ContentPickerComponent extends BaseComponent implements OnInit, OnDestroy {
  public itemsInBasket = '0';

  public selectedItems: Content[] = [];

  public searchText = '';
  public searchBehavior = SearchBehavior.SimplifiedSearch;
  public selectedChannel: Channel | null = null;
  public selectedFilter: FilterBase | null = null;

  public aggregations: AggregationResult[] = [];

  public detailsItemId: string | undefined = undefined;

  public loading = false;
  public messagePosted = false;
  public postUrl = '';

  @ViewChild(ContentBrowserComponent) contentBrowserComponent: ContentBrowserComponent;

  constructor(
    injector: Injector,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private embedService: EmbedService,
    private basketService: BasketService,
    private contentService: ContentService,
    public selectionService: SelectionService<Content>
  ) {
    super(injector);
  }

  public openDetails(item: ContentModel<Content>) {
    let index = this.contentBrowserComponent.items.findIndex(q => q.item.id === item.item.id);

    this.dialog.open(ContentDetailsDialogComponent, {
      data: <ContentDetailDialogOptions>{
        id: item.item.id,
        showMetadata: true,
        hasPrevious: () => {
          return index !== 0;
        },
        hasNext: () => {
          return this.contentBrowserComponent.items.length > index + 1;
        },
        previous: () => {
          index--;
          return this.contentBrowserComponent.items[index].item.id;
        },
        next: () => {
          index++;
          return this.contentBrowserComponent.items[index].item.id;
        },
      },
      autoFocus: false,
      width: '980px',
      height: '700px',
    });
  }

  public ngOnInit() {
    this.sub = this.basketService.basketChange.subscribe(items => (this.itemsInBasket = items.length.toString()));

    if (this.route.snapshot.queryParams['postUrl']) {
      this.postUrl = this.route.snapshot.queryParams['postUrl'];
    }
  }

  public selectionChange(items: Content[]): void {
    this.selectedItems = items;
  }

  addFilter(filter: AggregationFilter) {
    this.selectedFilter = filter.filter!;
    console.log(filter);
  }

  public async embed() {
    try {
      this.loading = true;
      this.messagePosted = await this.embedService.embed(this.selectedItems, this.postUrl);
    } finally {
      this.loading = false;
    }
  }

  public changeSearchParameters(searchParameters: SearchParameters) {
    this.searchText = searchParameters.searchString;
    this.searchBehavior = (searchParameters.searchBehavior as unknown) as SearchBehavior;
  }

  public changeChannel(channel: Channel) {
    this.selectedChannel = channel;
  }

  public aggregate = (aggregators: AggregatorBase[]) => {
    return this.contentService.aggregate(
      new ContentAggregationRequest({
        aggregators: aggregators,
        lifeCycleFilter: LifeCycleFilter.ActiveOnly,
        searchType: ContentSearchType.Metadata,
        brokenDependenciesFilter: BrokenDependenciesFilter.All,
        filter: this.selectedFilter ? this.selectedFilter : undefined,
      })
    );
  };

  log(data: any) {
    console.log(data);
  }
}
