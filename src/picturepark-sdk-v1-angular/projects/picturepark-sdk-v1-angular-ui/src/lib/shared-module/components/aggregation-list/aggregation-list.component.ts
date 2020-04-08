import { OnInit, Component, Input } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

// LIBRARIES
import {
  AggregationFilter, AggregationResult,
  AggregatorBase, SearchFacade, SearchInputState, IEntityBase
} from '@picturepark/sdk-v1-angular';

// COMPONENTS
import { BaseComponent } from '../../components/base.component';

@Component({
  selector: 'pp-aggregation-list',
  templateUrl: './aggregation-list.component.html',
  styleUrls: ['./aggregation-list.component.scss'],
})
export class AggregationListComponent extends BaseComponent implements OnInit {
  @Input()
  public facade: SearchFacade<IEntityBase, SearchInputState>;

  public isLoading = new BehaviorSubject(false);

  public aggregationResults: AggregationResult[] = [];

  aggregators$: Observable<AggregatorBase[]>;

  ngOnInit(): void {
    this.aggregators$ = this.facade.aggregators$;

    this.sub = this.facade.aggregationResults$.subscribe(i => {
      if (i) {
        this.processAggregationResults(i)
      }
     });
  }

  public clearFilters(): void {
    this.facade.patchRequestState({ aggregationFilters: [] });
  }

  public trackByName(_index, aggregator: AggregatorBase) {
    return aggregator.name;
  }

  private processAggregationResults(aggregationResults: AggregationResult[]) {
    this.aggregationResults = [];

    aggregationResults.forEach(aggregationResult => {
      const nested = this.getNestedAggregator(aggregationResult);
      // tslint:disable-next-line:no-non-null-assertion
      const aggregatorIndex = this.facade.searchRequestState.aggregators.findIndex(aggregator => {
        return nested.name.indexOf(aggregator.name) !== -1;
      });

      if (aggregatorIndex > -1) {
        this.aggregationResults[aggregatorIndex] = aggregationResult;
      }
    });
  }

  private getNestedAggregator(aggregation: AggregationResult): AggregationResult {
    if (aggregation.aggregationResultItems) {

      const filtered: AggregationResult[][] = aggregation.aggregationResultItems.filter(item =>
        item.aggregationResults != null
      ).map(m => m.aggregationResults as AggregationResult[]);

      const aggs = filtered.reduce((acc, val) => acc.concat(val), []);

      if (aggs.length === 1) {
        return aggs[0];
      }
    }

    return aggregation;
  }
}
