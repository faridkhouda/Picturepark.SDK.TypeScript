import { moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService, AccessTokenAuthService, PICTUREPARK_CONFIGURATION } from '@picturepark/sdk-v1-angular';
import { PICTUREPARK_UI_CONFIGURATION, ContentDetailsDialogModule, SharedModule } from '@picturepark/sdk-v1-angular-ui';
import { PictureparkConfigurationFactory, PictureparkUIConfigurationFactory } from './config';
import { ContentDetailsDialogDemoComponent } from './components/content-details-dialog-demo/content-details-dialog-demo.component';

export default {
    title: 'Content Details Dialog',
    decorators: [
        withKnobs,
        moduleMetadata({
            imports: [ContentDetailsDialogModule, SharedModule.forRoot(), HttpClientModule, BrowserAnimationsModule],
            providers: [
                { provide: AuthService, useClass: AccessTokenAuthService },
                { provide: PICTUREPARK_CONFIGURATION, useFactory: PictureparkConfigurationFactory },
                { provide: PICTUREPARK_UI_CONFIGURATION, useFactory: PictureparkUIConfigurationFactory },
            ]
        })]
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
    }
});
