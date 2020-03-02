import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService, ShareContentDetail, ShareDetail } from '@picturepark/sdk-v1-angular';
import { ContentDetailDialogOptions, ContentDetailsDialogComponent } from '@picturepark/sdk-v1-angular-ui';
import { MatDialog } from '@angular/material/dialog';

@Component({
    template: `<div><button (click)="openDetails">Click me</button></div>`
})
export class ContentDetailsDialogDemoComponent implements OnInit {
    @Input() public itemId: string;
    @Input() public shareContent: ShareContentDetail;
    @Input() public shareDetail: ShareDetail;

    // public selectedSchema: SchemaDetail;

    constructor(private authService: AuthService,
        private dialog: MatDialog) { }

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
        let index = this.shareDetail.contentSelections.indexOf(this.shareContent);
        this.dialog.open(ContentDetailsDialogComponent,
            {
                data: <ContentDetailDialogOptions>{
                    id: this.itemId,
                    shareContent: this.shareContent,
                    shareDetail: this.shareDetail,
                    showMetadata: false,
                    hasPrevious: () => {
                        return index !== 0;
                    },
                    hasNext: () => {
                        return this.shareDetail.contentSelections.length > index + 1;
                    },
                    previous: () => {
                        index--;
                        return this.shareDetail.contentSelections[index];
                    },
                    next: () => {
                        index++;
                        return this.shareDetail.contentSelections[index];
                    }
                },
                autoFocus: false,
                width: '980px',
                height: '700px',
                maxWidth: '98vw',
                maxHeight: '99vh'
            }
        );
    }
}
