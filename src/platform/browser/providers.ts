/*
 * These are globally available services in any component or any other service
 */


import {provide} from '@angular/core';

// Angular 2
import {FORM_PROVIDERS, PathLocationStrategy, LocationStrategy} from '@angular/common';

// Angular 2 Http
import {HTTP_PROVIDERS} from '@angular/http';
// Angular 2 Router
import { provideRouter } from '@angular/router';

// Angular 2 Material
// import {MdRadioDispatcher} from '@angular2-material/radio/radio_dispatcher';
// const MATERIAL_PROVIDERS = [
//   MdRadioDispatcher
// ];



import { routes } from '../../app/app.routes';
/*
 * Application Providers/Directives/Pipes
 * providers/directives/pipes that only live in our browser environment
 */
export const APPLICATION_PROVIDERS = [
  ...FORM_PROVIDERS,
  ...HTTP_PROVIDERS,
  // ...MATERIAL_PROVIDERS,
  provideRouter(routes),
  {provide: LocationStrategy, useClass: PathLocationStrategy }
];

export const PROVIDERS = [
  ...APPLICATION_PROVIDERS
];
