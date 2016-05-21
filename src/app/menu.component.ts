import {Component, Input, Output} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {EventEmitter} from 'events';
import {AppConfig} from './services/config.service';
import {CollapseDirective} from 'ng2-bootstrap/ng2-bootstrap';

@Component({
    selector: 'lxd-header',
    templateUrl: 'assets/templates/menu.component.html',
    directives: [
        CORE_DIRECTIVES,
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
        // Record new LXD Server URL in localstorage
        localStorage.setItem('lxd_server_url', lxdServerUrl);
        // Apply new LXD Server URL into application configuration
        this.appConfig.lxdServerUrl = lxdServerUrl;
    }
}
