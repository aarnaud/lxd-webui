/*
 * Providers provided by Angular
 */
import {bootstrap} from 'angular2/platform/browser';
import {provideInitialState, hotModuleReplacement} from 'angular2-hmr';

/*
 * App Component
 * our top level component that holds all of our components
 */
import {AppComponent} from './app/app.component';

/*
 * Bootstrap our Angular app with a top level component `App` and inject
 * our Services and Providers into Angular's dependency injection
 */
export function main(initialState = {}) {
    let APP_PROVIDERS = [
        provideInitialState(initialState),
    ];

    return bootstrap(AppComponent, [
        ...APP_PROVIDERS,
    ])
        .catch(err => console.error(err));

}

/*
 * Vendors
 * For vendors for example jQuery, Lodash, angular2-jwt just import them anywhere in your app
 * You can also import them in vendors to ensure that they are bundled in one file
 * Also see custom-typings.d.ts as you also need to do `typings install x` where `x` is your module
 */


/*
 * Hot Module Reload
 * experimental version by @gdi2290
 */
if ('development' === ENV && HMR === true) {
    // activate hot module reload
    hotModuleReplacement(main, module);
} else {
    // bootstrap when documetn is ready
    document.addEventListener('DOMContentLoaded', () => main());
}