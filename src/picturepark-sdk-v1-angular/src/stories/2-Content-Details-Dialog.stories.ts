import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccessTokenAuthService, AuthService, PICTUREPARK_CONFIGURATION } from '@picturepark/sdk-v1-angular';
import {
  ContentDetailsDialogModule,
  PictureparkUIConfiguration,
  PICTUREPARK_UI_CONFIGURATION,
  SharedModule,
} from '@picturepark/sdk-v1-angular-ui';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { PictureparkAppSetting } from 'src/config';
import { ContentDetailsDialogDemoComponent } from './components/content-details-dialog-demo/content-details-dialog-demo.component';

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
  title: 'Content Details Dialog',
  decorators: [
    withKnobs,
    moduleMetadata({
      imports: [ContentDetailsDialogModule, SharedModule.forRoot(), HttpClientModule, BrowserAnimationsModule],
      providers: [
        { provide: AuthService, useClass: AccessTokenAuthService },
        { provide: PICTUREPARK_CONFIGURATION, useFactory: oidcConfigFactory },
        { provide: PICTUREPARK_UI_CONFIGURATION, useFactory: pictureparkUIConfigurationFactory },
      ],
    }),
  ],
};

export const ContentDetailsDialogComponentWithKnobs = () => ({
  component: ContentDetailsDialogDemoComponent,
  props: {
    // enableSelection: boolean('enableSelection', true),
    // selectedFilter: null,
    // searchText: text('searchText', ''),
    // searchBehavior: select('searchBehavior', SearchBehavior, SearchBehavior.SimplifiedSearch),
    // previewItemChange: action('Preview item changed'),
    // selectedItemsChange: action('Selected items changed'),
    // totalResultsChange: action('Total results changed')
  },
});
