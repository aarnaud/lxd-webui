import {Component}       from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS}    from 'angular2/http';
import {ContainerService}     from './services/container.service';
import {ContainersComponent} from './components/container/containers.component';
import {ContainerDetailComponent} from './components/container/container-detail.component';
import {RouteDefinition} from 'angular2/router';

@Component({
    selector: 'lxd-app',
    templateUrl: 'assets/templates/app.component.html',
    directives: [
        ROUTER_DIRECTIVES
    ],
    providers: [
        HTTP_PROVIDERS,
        ROUTER_PROVIDERS,
        ContainerService
    ]
})

@RouteConfig([
    <RouteDefinition>{
        path: '/containers',
        name: 'Containers',
        component: ContainersComponent,
        useAsDefault: true
    },
    <RouteDefinition>{
        path: '/container/:id',
        name: 'ContainerDetail',
        component: ContainerDetailComponent
    }
])

export class AppComponent {
    title = 'LXD WebUI';
}
