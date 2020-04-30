import { moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  AuthService,
  AccessTokenAuthService,
  SearchBehavior,
  PICTUREPARK_CONFIGURATION,
} from '@picturepark/sdk-v1-angular';
import { PICTUREPARK_UI_CONFIGURATION, ListBrowserModule } from '@picturepark/sdk-v1-angular-ui';
import { PictureparkConfigurationFactory, PictureparkUIConfigurationFactory } from './config';
import { ListBrowserDemoComponent } from './components/list-browser-demo/list-browser-demo.component';

export enum SchemaId {
  MediaType = 'MediaType',
  License = 'License',
  Organisation = 'Organisation',
  Person = 'Person',
  DocumentInformation = 'DocumentInformation',
  ImageInformation = 'ImageInformation',
  MultimediaInformation = 'MultimediaInformation',
  OtherContentInformation = 'OtherContentInformation',
}

export default {
  title: 'List Browser',
  decorators: [
    withKnobs,
    moduleMetadata({
      imports: [ListBrowserModule, HttpClientModule, BrowserAnimationsModule],
      providers: [
        { provide: AuthService, useClass: AccessTokenAuthService },
        { provide: PICTUREPARK_CONFIGURATION, useFactory: PictureparkConfigurationFactory },
        { provide: PICTUREPARK_UI_CONFIGURATION, useFactory: PictureparkUIConfigurationFactory },
      ],
    }),
  ],
};

export const ListBrowserComponentWithKnobs = () => ({
  component: ListBrowserDemoComponent,
  props: {
    enableSelection: boolean('enableSelection', true),
    selectedFilter: null,
    searchText: text('searchText', ''),
    searchBehavior: select('searchBehavior', SearchBehavior, SearchBehavior.SimplifiedSearch),
    schemaId: select('schemaId', SchemaId, SchemaId.MediaType),
    previewItemChange: action('Preview item changed'),
    selectedItemsChange: action('Selected items changed'),
    totalResultsChange: action('Total results changed'),
  },
});
