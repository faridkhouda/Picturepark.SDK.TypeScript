import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { take } from 'rxjs/operators';
import { AuthService, FilterBase, ListItem, SchemaDetail, SchemaService, SearchBehavior, SortInfo } from '@picturepark/sdk-v1-angular';
import { ContentModel } from '@picturepark/sdk-v1-angular-ui';

@Component({
    template: `<pp-list-browser [schema]="selectedSchema"
                                [selectedItemIds]="selectedItemIds"
                                [enableSelection]="enableSelection"
                                [sortInfo]="sortInfo"
                                [filter]="selectedFilter"
                                [searchString]="searchText"
                                [searchBehavior]="searchBehavior"
                                (previewItemChange)="openDetails($event)"
                                (selectedItemsChange)="selectionChange($event)"
                                (totalResultsChange)="resultsChange($event)">
                </pp-list-browser>`
})
export class ListBrowserDemoComponent implements OnInit {
    @Input() public selectedItemIds: string[];
    @Input() public enableSelection: boolean;
    @Input() public sortInfo: SortInfo[];
    @Input() public selectedFilter: FilterBase | null = null;
    @Input() public searchText = '';
    @Input() public searchBehavior: SearchBehavior;

    @Output() public previewItemChange = new EventEmitter<ContentModel<ListItem>>();
    @Output() public selectedItemsChange = new EventEmitter<ListItem[]>();
    @Output() public totalResultsChange = new EventEmitter<number | null>();

    public selectedSchema: SchemaDetail;

    constructor(private authService: AuthService, private schemaService: SchemaService) { }

    ngOnInit(): void {
        this.schemaService.getMany(null).pipe(
            take(1),
        ).subscribe(
            (channels) => {
                this.selectedSchema = channels[0];
            },
            () => {
                console.log('schema service error');
            });
    }

    public openDetails(item: ContentModel<ListItem>) {
        this.previewItemChange.emit(item);
    }

    public selectionChange(items: ListItem[]): void {
        this.selectedItemsChange.emit(items);
    }

    public resultsChange(totalResults: number | null): void {
        this.totalResultsChange.emit(totalResults);
    }
}
