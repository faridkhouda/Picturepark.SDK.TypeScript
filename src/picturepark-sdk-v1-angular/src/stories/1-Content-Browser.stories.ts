import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  AccessTokenAuthService,
  AuthService,
  PICTUREPARK_CONFIGURATION,
  SearchBehavior,
} from '@picturepark/sdk-v1-angular';
import {
  ContentBrowserModule,
  PictureparkUIConfiguration,
  PICTUREPARK_UI_CONFIGURATION,
} from '@picturepark/sdk-v1-angular-ui';
import { action } from '@storybook/addon-actions';
import { select, text, withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { PictureparkAppSetting } from 'src/config';
import { ContentBrowserDemoComponent } from './components/content-browser-demo/content-browser-demo.component';

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

export default {
  title: 'Content Browser',
  decorators: [
    withKnobs,
    moduleMetadata({
      imports: [ContentBrowserModule, HttpClientModule, BrowserAnimationsModule],
      providers: [
        { provide: AuthService, useClass: AccessTokenAuthService },
        { provide: PICTUREPARK_CONFIGURATION, useFactory: oidcConfigFactory },
        { provide: PICTUREPARK_UI_CONFIGURATION, useFactory: pictureparkUIConfigurationFactory },
      ],
    }),
  ],
};

export const ContentBrowserComponentWithKnobs = () => ({
  component: ContentBrowserDemoComponent,
  props: {
    selectedFilter: null,
    searchText: text('searchText', ''),
    searchBehavior: select('searchBehavior', SearchBehavior, SearchBehavior.SimplifiedSearch),
    previewItemChange: action('Preview item changed'),
    selectedItemsChange: action('Selected items changed'),
    totalResultsChange: action('Total results changed'),
  },
});
