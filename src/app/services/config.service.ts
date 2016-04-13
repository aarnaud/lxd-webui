import {Injectable, Output, EventEmitter} from 'angular2/core';

@Injectable()
export class AppConfig {
    @Output() onChangeConfig = new EventEmitter();
    private _LXDServerUrl: string;

    constructor() {
        // Get LXD Server URL in localstorage
        var LXDServerUrl = localStorage.getItem('lxd_server_url');
        // If LXD Server URL not found, set default URL to localhost
        if (LXDServerUrl === null) {
            this._LXDServerUrl = 'https://127.0.0.1:8443';
        } else {
            this._LXDServerUrl = LXDServerUrl;
        }
    }

    get LXDServerUrl(): string {
        return this._LXDServerUrl;
    }

    set LXDServerUrl(value: string) {
        this.onChangeConfig.emit('change');
        this._LXDServerUrl = value;
    }

    get LXDServer(){
        return this._LXDServerUrl.split('/')[2];
    }

    get LXDProtocol(){
        return this._LXDServerUrl.split('/')[0] + '//';
    }
}
