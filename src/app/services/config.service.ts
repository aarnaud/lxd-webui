import {Injectable, Output, EventEmitter} from '@angular/core';

@Injectable()
export class AppConfig {
    @Output() onChangeConfig = new EventEmitter();
    private _lxdServerUrl: string;

    constructor() {
        // Get LXD Server URL in localstorage
        let lxdServerUrl = localStorage.getItem('lxd_server_url');
        // If LXD Server URL not found, set default URL to localhost
        if (!lxdServerUrl) {
            this._lxdServerUrl = 'https://127.0.0.1:8443';
        } else {
            this._lxdServerUrl = lxdServerUrl;
        }
    }

    get lxdServerUrl(): string {
        return this._lxdServerUrl;
    }

    set lxdServerUrl(value: string) {
        this.onChangeConfig.emit('change');
        this._lxdServerUrl = value;
    }

    get LXDServer(){
        return this._lxdServerUrl.split('/')[2];
    }

    get LXDProtocol(){
        return this._lxdServerUrl.split('/')[0] + '//';
    }
}
