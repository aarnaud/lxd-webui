import {Injectable, Output, EventEmitter} from 'angular2/core';

@Injectable()
export class AppConfig {
    @Output() onChangeConfig = new EventEmitter();
    private _LXDServerUrl: string = 'https://127.0.0.1:8443';

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
