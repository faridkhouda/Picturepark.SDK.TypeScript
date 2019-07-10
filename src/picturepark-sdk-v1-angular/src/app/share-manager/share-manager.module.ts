import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// LIBRARIES
import {
  ApplicationHeaderModule, ApplicationMenuModule, BrowserToolbarModule, ContentAggregationListModule, ItemsMenuModule,
  PanelModule, PreviewModule, SearchBoxModule, SharedModule, ShareBrowserModule, ItemToolBarModule
} from '@picturepark/sdk-v1-angular-ui';

// MODULES
import { ShareManagerRoutingModule } from './share-manager-routing.module';

// COMPONENTS
import { ShareBrowserComponent } from './share-manager.component';
import { ShareManagerItemComponent } from './components/share-manager-item/share-manager-item.component';
import { SharesManagerComponent } from './components/shares-manager/shares-manager.component';

@NgModule({
  declarations: [
    ShareBrowserComponent,
    ShareManagerItemComponent,
    SharesManagerComponent
  ],
  imports: [
    CommonModule,
    ApplicationHeaderModule,
    ApplicationMenuModule,
    BrowserToolbarModule,
    ContentAggregationListModule,
    ItemsMenuModule,
    PanelModule,
    PreviewModule,
    ShareManagerRoutingModule,
    SharedModule,
    SearchBoxModule,
    ShareBrowserModule,
    ItemToolBarModule
  ]
})
export class ShareManagerModule { }
