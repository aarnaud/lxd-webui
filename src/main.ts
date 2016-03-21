import {bootstrap}    from 'angular2/platform/browser'
import {AppComponent} from './app/app.component'

// Angular 2
export function main() {
    return bootstrap(AppComponent, []);
}

// Hot Module Replacement
export function bootstrapDomReady() {
    // bootstrap after document is ready
    document.addEventListener('DOMContentLoaded', main);
}

if ('development' === ENV) {
    // activate hot module reload
    if (HMR) {
        if (document.readyState === 'complete') {
            main();
        } else {
            bootstrapDomReady();
        }
        module.hot.accept();
    } else {
        bootstrapDomReady();
    }
} else {
    bootstrapDomReady();
}