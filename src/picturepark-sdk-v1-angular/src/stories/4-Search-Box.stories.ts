import { moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { boolean, text, withKnobs, select } from '@storybook/addon-knobs';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtendedSearchBehavior, SearchBoxModule } from '@picturepark/sdk-v1-angular-ui';

export default {
  title: 'Search Box',
  decorators: [
    withKnobs,
    moduleMetadata({
      imports: [SearchBoxModule, BrowserAnimationsModule],
    }),
  ],
};

export const SearchBox = () => ({
  template: `
    <pp-search-box [searchString]="searchString"
                   [searchBehavior]="searchBehavior"
                   [showSearchBehaviorPicker]="showSearchBehaviorPicker"
                   (searchStringChange)="searchStringChange($event)"
                   (searchParametersChange)="searchParametersChange($event)">
    </pp-search-box>`,
  props: {
    searchString: text('searchString', ''),
    searchBehavior: select('searchBehavior', ExtendedSearchBehavior, ExtendedSearchBehavior.SimplifiedSearch),
    showSearchBehaviorPicker: boolean('showSearchBehaviorPicker', false),
    searchStringChange: action('Search string changed'),
    searchParametersChange: action('Search parameters changed'),
  },
});
