import { Component }       from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';
import {HTTP_PROVIDERS}    from 'angular2/http';
import { ContainerService }     from './container.service';
import { ContainersComponent } from './containers.component';
import { ContainerDetailComponent } from './container-detail.component';
@Component({
    selector: 'lxd-app',
    template: `
    <h1>{{title}}</h1>
    <a [routerLink]="['Containers']">Containers</a>
    <router-outlet></router-outlet>
  `,
    directives: [
        ROUTER_DIRECTIVES,
    ],
    providers: [
        HTTP_PROVIDERS,
        ROUTER_PROVIDERS,
        ContainerService
    ]
})

@RouteConfig([
    {
        path: '/containers',
        name: 'Containers',
        component: ContainersComponent,
        useAsDefault: true
    },
    {
        path: '/container/:id',
        name: 'ContainerDetail',
        component: ContainerDetailComponent
    }
])

export class AppComponent {
    title = 'LXD WebUI';
}