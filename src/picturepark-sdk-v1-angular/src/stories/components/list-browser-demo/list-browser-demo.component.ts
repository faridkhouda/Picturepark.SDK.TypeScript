import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AuthService,
  FilterBase,
  ListItem,
  SchemaDetail,
  SchemaService,
  SearchBehavior,
  SortInfo,
} from '@picturepark/sdk-v1-angular';
import { take } from 'rxjs/operators';

@Component({
  template: `<pp-list-browser
    *ngIf="selectedSchema"
    [schema]="selectedSchema"
    [selectedItemIds]="selectedItemIds"
    [enableSelection]="enableSelection"
    [sortInfo]="sortInfo"
    (previewItemChange)="openDetails($event)"
    (selectedItemsChange)="selectionChange($event)"
    (totalResultsChange)="resultsChange($event)"
  >
  </pp-list-browser>`,
})
export class ListBrowserDemoComponent implements OnInit {
  @Input() public selectedItemIds: string[];
  @Input() public enableSelection: boolean;
  @Input() public sortInfo: SortInfo[];
  @Input() public selectedFilter: FilterBase | null = null;
  @Input() public searchText = '';
  @Input() public searchBehavior: SearchBehavior;
  @Input() public schemaId = 'MediaType';

  @Output() public previewItemChange = new EventEmitter<ListItem>();
  @Output() public selectedItemsChange = new EventEmitter<ListItem[]>();
  @Output() public totalResultsChange = new EventEmitter<number | null>();

  public selectedSchema: SchemaDetail;

  constructor(private authService: AuthService, private schemaService: SchemaService) {}

  async ngOnInit(): Promise<void> {
    this.schemaService
      .getMany([this.schemaId])
      .pipe(take(1))
      .subscribe(
        (schemas) => {
          this.selectedSchema = schemas[0];
        },
        () => {
          console.log('schema service error');
        }
      );
  }

  public openDetails(item: ListItem) {
    this.previewItemChange.emit(item);
  }

  public selectionChange(items: ListItem[]): void {
    this.selectedItemsChange.emit(items);
  }

  public resultsChange(totalResults: number | null): void {
    this.totalResultsChange.emit(totalResults);
  }
}
