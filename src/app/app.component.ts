import {Component}       from '@angular/core';
import {
    RouteConfig,
    ROUTER_DIRECTIVES,
    ROUTER_PROVIDERS,
    Router,
    RouteDefinition
} from '@angular/router-deprecated';
import {HTTP_PROVIDERS}    from '@angular/http';
import {ContainerService}     from './services/container.service';
import {ContainersComponent} from './components/container/containers.component';
import {ContainerDetailComponent} from './components/container/container-detail.component';
import {HeaderComponent} from './menu.component';
import {Toasty} from 'ng2-toasty/ng2-toasty';

@Component({
    selector: 'lxd-app',
    templateUrl: 'assets/templates/app.component.html',
    directives: [
        ROUTER_DIRECTIVES,
        HeaderComponent,
        Toasty
    ],
    providers: [
        HTTP_PROVIDERS,
        ROUTER_PROVIDERS,
        ContainerService
    ]
})

@RouteConfig([
    <RouteDefinition>{
        path: '/',
        name: 'Home',
        component: ContainersComponent,
        useAsDefault: true
    },
    <RouteDefinition>{
        path: '/containers',
        name: 'Containers',
        component: ContainersComponent
    },
    <RouteDefinition>{
        path: '/container/:id',
        name: 'ContainerDetail',
        component: ContainerDetailComponent
    }
])

export class AppComponent {
    title: string = 'LXD WebUI';
}
