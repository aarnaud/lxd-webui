import {Component, Input, Output} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {AppConfig} from './services/config.service';
import {CollapseDirective} from 'ng2-bootstrap/ng2-bootstrap';

@Component({
    selector: 'lxd-header',
    templateUrl: 'assets/templates/menu.component.html',
    directives: [
        CORE_DIRECTIVES,
        ROUTER_DIRECTIVES,
        CollapseDirective
    ]
})

export class HeaderComponent {
    public isCollapsed: boolean = true;
    @Input() title: string;

    constructor(private appConfig: AppConfig) {
    }

    get lxdServerUrl(){
        return this.appConfig.lxdServerUrl;
    }

    private onLXDUrl(event: KeyboardEvent) {
        let lxdServerUrl = (<HTMLInputElement>event.target).value;

        // Apply new LXD Server URL into application configuration
        this.appConfig.lxdServerUrl = lxdServerUrl;
    }
}
