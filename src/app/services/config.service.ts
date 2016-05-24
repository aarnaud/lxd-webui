import {Injectable, Output, EventEmitter} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AppConfig {
    @Output() onChangeConfig = new EventEmitter();
    private _lxdServerUrl: string;
    private _lxdBaseUrl: string;
    private _apiVersion = '1.0';

    constructor(private http: Http) {
        // Get LXD Server URL in localstorage
        let lxdServerUrl = localStorage.getItem('lxd_server_url');
        // If LXD Server URL not found, set default URL to localhost
        if (!lxdServerUrl) {
            this._lxdServerUrl = 'https://127.0.0.1:8443';
        } else {
            this._lxdServerUrl = lxdServerUrl;
        }
    }

    public checkLxdConnection(): Observable<any> {
        return this.http.get(`${this.lxdBaseUrl}`)
            .map((res: Response) => this.checkLxdApiResponse(res))
            .catch(this.handleError);
    }

    get lxdServerUrl(): string {
        return this._lxdServerUrl;
    }

    set lxdServerUrl(value: string) {
        this._lxdServerUrl = value;
        // Record new LXD Server URL in localstorage
        localStorage.setItem('lxd_server_url', value);
        this.generateBaseUrl();
    }

    get lxdServer() {
        return this._lxdServerUrl.split('/')[2];
    }

    get lxdProtocol() {
        return this._lxdServerUrl.split('/')[0] + '//';
    }

    get apiVersion() {
        return this._apiVersion;
    }

    get lxdBaseUrl() {
        if (!this._lxdBaseUrl) {
            this.generateBaseUrl();
        }
        return this._lxdBaseUrl;
    }

    private generateBaseUrl() {
        this._lxdBaseUrl = `${this.lxdProtocol}${this.lxdServer}/${this.apiVersion}`;
        this.onChangeConfig.emit('change');
    }

    private handleError(error: Response): Observable<string> {
        console.error(error);
        if (error.headers.keys().length === 0) {
            return Observable.throw('net::ERR_INSECURE_RESPONSE');
        }
        if (error.headers.has('LXD_VALIDATION')) {
            return Observable.throw(error.headers.get('LXD_VALIDATION'));
        }
        return Observable.throw('NOT_LXD_SERVER');
    }

    private checkLxdApiResponse(res: Response) {
        if (res.headers.get('Content-Type').indexOf('application/json') !== -1 &&
            res.json().metadata && res.json().metadata.api_version
        ) {
            return res.json();
        }
        res.headers.append('LXD_VALIDATION', 'NOT_LXD_SERVER');
        throw res;
    }
}
