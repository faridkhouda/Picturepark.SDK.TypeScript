import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

// LIBRARIES
import { AggregationResult, Channel, FilterBase, Content, AggregatorBase, ContentService, ContentAggregationRequest, LifeCycleFilter, ContentSearchType, BrokenDependenciesFilter } from '@picturepark/sdk-v1-angular';
import { ContentItemSelectionService, BasketService } from '@picturepark/sdk-v1-angular-ui';

// COMPONENTS
import { ContentDetailsDialogComponent } from '@picturepark/sdk-v1-angular-ui';

// SERVICES
import { EmbedService } from './embed.service';
import { ContentModel } from 'projects/picturepark-sdk-v1-angular-ui/src/lib/shared-module/models/content-model';

@Component({
  templateUrl: './content-picker.component.html',
  styleUrls: ['./content-picker.component.scss']
})
export class ContentPickerComponent implements OnInit, OnDestroy {
  public basketItemsCount = 0;

  public selectedItems: ContentModel<Content>[] = [];

  public searchText = '';
  public selectedChannel: Channel | null = null;
  public selectedFilter: FilterBase | null = null;

  public aggregations: AggregationResult[] = [];

  public detailsItemId: string | undefined = undefined;

  public loading = false;
  public messagePosted = false;
  public postUrl = '';
  public mobileQuery: MediaQueryList;

  private mobileQueryListener: () => void;
  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private embedService: EmbedService,
    private basketService: BasketService,
    private contentService: ContentService,
    public contentItemSelectionService: ContentItemSelectionService<Content>,
    private media: MediaMatcher,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  public openDetails(item: ContentModel<Content>) {
    this.dialog.open(ContentDetailsDialogComponent,
      { data: { id: item.item.id }, width: '980px', height: '700px' }
    );
  }

  public ngOnInit() {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);

    const basketSubscription = this.basketService.basketChange.subscribe(items => this.basketItemsCount = items.length);
    this.subscription.add(basketSubscription);

    if (this.route.snapshot.queryParams['postUrl']) {
      this.postUrl = this.route.snapshot.queryParams['postUrl'];
    }
  }

  public selectionChange(items: ContentModel<Content>[]): void {
    this.selectedItems = items;
  }

  public async embed() {
    try {
      this.loading = true;
      this.messagePosted = await this.embedService.embed(this.selectedItems, this.postUrl);
    } finally {
      this.loading = false;
    }
  }

  public changeSearchQuery(query: string) {
    this.searchText = query;
  }

  public changeChannel(channel: Channel) {
    this.selectedChannel = channel;
  }

  public aggregate = (aggregators: AggregatorBase[]) => {
    return this.contentService.aggregate(new ContentAggregationRequest({
      aggregators: aggregators,
      lifeCycleFilter: LifeCycleFilter.ActiveOnly,
      searchType: ContentSearchType.Metadata,
      brokenDependenciesFilter: BrokenDependenciesFilter.All,
      filter: this.selectedFilter ? this.selectedFilter : undefined
    }));
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }
}
