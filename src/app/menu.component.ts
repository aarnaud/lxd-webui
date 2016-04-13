import {Component, Input, Output} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {EventEmitter} from 'events';
import {AppConfig} from './services/config.service';

@Component({
    selector: 'demo-header',
    templateUrl: 'assets/templates/menu.component.html',
    directives: [
        CORE_DIRECTIVES
    ]
})

export class Header {
    public isCollapsed: boolean = true;
    @Input() title: string;

    constructor(private appConfig: AppConfig) {
    }

    get LXDServerUrl(){
        return this.appConfig.LXDServerUrl;
    }

    private onLXDUrl(event: KeyboardEvent) {
        var LXDServerUrl = (<HTMLInputElement>event.target).value;
        // Record new LXD Server URL in localstorage
        localStorage.setItem('lxd_server_url', LXDServerUrl);
        // Apply new LXD Server URL into application configuration
        this.appConfig.LXDServerUrl = LXDServerUrl;
    }
}
