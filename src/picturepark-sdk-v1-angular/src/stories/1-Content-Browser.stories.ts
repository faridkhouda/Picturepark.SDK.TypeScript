import { moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { select, text, withKnobs } from '@storybook/addon-knobs';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService, AccessTokenAuthService, SearchBehavior, PICTUREPARK_CONFIGURATION } from '@picturepark/sdk-v1-angular';
import { ContentBrowserModule, PICTUREPARK_UI_CONFIGURATION } from '@picturepark/sdk-v1-angular-ui';
import { ContentBrowserDemoComponent } from './components/content-browser-demo/content-browser-demo.component';
import { PictureparkConfigurationFactory, PictureparkUIConfigurationFactory } from './config';

export default {
    title: 'Content Browser',
    decorators: [
        withKnobs,
        moduleMetadata({
            imports: [ContentBrowserModule, HttpClientModule, BrowserAnimationsModule],
            providers: [
                { provide: AuthService, useClass: AccessTokenAuthService },
                { provide: PICTUREPARK_CONFIGURATION, useFactory: PictureparkConfigurationFactory },
                { provide: PICTUREPARK_UI_CONFIGURATION, useFactory: PictureparkUIConfigurationFactory }
            ]
        })]
};

export const ContentBrowserComponentWithKnobs = () => ({
    component: ContentBrowserDemoComponent,
    props: {
        selectedFilter: null,
        searchText: text('searchText', ''),
        searchBehavior: select('searchBehavior', SearchBehavior, SearchBehavior.SimplifiedSearch),
        previewItemChange: action('Preview item changed'),
        selectedItemsChange: action('Selected items changed'),
        totalResultsChange: action('Total results changed')
    }
});
