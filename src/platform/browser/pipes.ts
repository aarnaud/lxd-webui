/*
 * These are globally available pipes in any template
 */

import {provide, PLATFORM_PIPES} from '@angular/core';

// application_pipes: pipes that are global through out the application
export const APPLICATION_PIPES = [

];

export const PIPES = [
  provide(PLATFORM_PIPES, {useValue: APPLICATION_PIPES, multi: true})
];
