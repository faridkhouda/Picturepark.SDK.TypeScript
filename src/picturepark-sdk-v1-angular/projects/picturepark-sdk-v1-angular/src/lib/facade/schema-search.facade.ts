import { SearchInputState, SearchFacade } from './search.facade';
import {
  Schema,
  SchemaService,
  SchemaSearchResult,
  FilterBase,
  OrFilter,
  PrefixFilter,
  TermFilter,
  SchemaSearchRequest,
  SearchBehavior,
  AggregatorBase,
  AggregationResult,
} from '../services/api-services';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface SchemaSearchInputState extends SearchInputState {
  parentSchema: Schema;
}

@Injectable({
  providedIn: 'root',
})
export class SchemaSearchFacade extends SearchFacade<Schema, SchemaSearchInputState> {
  constructor(private schemaService: SchemaService) {
    super({});
  }

  search(): Observable<SchemaSearchResult> | undefined {
    let filter: FilterBase | null = null;
    const parentSchema = this.searchRequestState.parentSchema;
    if (parentSchema) {
      filter = new OrFilter({
        filters: [
          new PrefixFilter({ field: 'schemaNamespace', prefix: parentSchema.id }),
          new TermFilter({ field: 'id', term: parentSchema.id }),
        ],
      });
    }

    const request = new SchemaSearchRequest({
      debugMode: false,
      pageToken: this.searchResultState.nextPageToken,
      limit: this.searchRequestState.pageSize,
      filter: filter ? filter : this.searchRequestState.baseFilter, // TODO BRO: Check
      searchString: this.searchRequestState.searchString,
      searchBehaviors: [SearchBehavior.DropInvalidCharactersOnFailure, SearchBehavior.WildcardOnSingleTerm],
      // aggregationFilters: this.searchInputState.aggregationFilters, TODO BRO: Check
      // aggregators: this.searchInputState.aggregators,
      sort: this.searchRequestState.sort,
    });

    return this.schemaService.search(request);
  }

  searchAggregations(aggregators: AggregatorBase[]): Observable<AggregationResult[]> | undefined {
    throw new Error("Method not implemented.");
  }
}
