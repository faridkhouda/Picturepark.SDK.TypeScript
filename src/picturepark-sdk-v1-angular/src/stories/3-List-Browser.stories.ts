import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  AccessTokenAuthService,
  AuthService,
  PICTUREPARK_CONFIGURATION,
  SearchBehavior,
} from '@picturepark/sdk-v1-angular';
import {
  ListBrowserModule,
  PictureparkUIConfiguration,
  PICTUREPARK_UI_CONFIGURATION,
} from '@picturepark/sdk-v1-angular-ui';
import { action } from '@storybook/addon-actions';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { PictureparkAppSetting } from 'src/config';
import { ListBrowserDemoComponent } from './components/list-browser-demo/list-browser-demo.component';

export function oidcConfigFactory() {
  return PictureparkAppSetting();
}

export function pictureparkUIConfigurationFactory() {
  return <PictureparkUIConfiguration>{
    ContentBrowserComponent: {
      download: true,
      select: true,
      share: true,
      preview: true,
      basket: true,
    },
    BasketComponent: {
      download: true,
      select: false,
      share: true,
    },
    BrowserToolbarComponent: {
      select: true,
    },
    ListBrowserComponent: {
      download: true,
      select: true,
      share: true,
    },
  };
}

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
        { provide: PICTUREPARK_CONFIGURATION, useFactory: oidcConfigFactory },
        { provide: PICTUREPARK_UI_CONFIGURATION, useFactory: pictureparkUIConfigurationFactory },
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
