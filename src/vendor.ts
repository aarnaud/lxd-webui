// For vendors for example jQuery, Lodash, angular2-jwt just import them here unless you plan on
// chunking vendors files for async loading. You would need to import the async loaded vendors
// at the entry point of the async loaded file. Also see custom-typings.d.ts as you also need to
// run `typings install x` where `x` is your module

// Angular 2
import 'angular2/platform/browser';
import 'angular2/core';
import 'angular2/http';
import 'angular2/router';

// RxJS
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/forkJoin';

//material
import '@angular2-material/core'
import '@angular2-material/checkbox'
import '@angular2-material/button'
import '@angular2-material/progress-circle'
import '@angular2-material/sidenav'
import '@angular2-material/toolbar'

if ('production' === ENV) {
    // Production


} else {
    // Development

}
