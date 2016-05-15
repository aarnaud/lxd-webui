import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Container} from '../models/container';
import {Operation} from '../models/operation';
import {AppConfig} from './config.service';

@Injectable()
export class ContainerService {
    constructor(private appConfig: AppConfig, private http: Http) {
        appConfig.onChangeConfig.subscribe( e => this.loadServerConfig());
        this.loadServerConfig();
    }

    private _protocole;
    private _lxdServer;  // URL to web api
    private _apiVersion = '1.0';  // URL to web api
    private _lxdBaseUrl;

   public getContainers(): Observable<Observable<Container[]>> {
        let observableBatch = [];
        return this.http.get(this._lxdBaseUrl + '/' + this._apiVersion + '/containers')
            .map(res => {
                res.json()['metadata'].forEach(
                    (url) => observableBatch.push(this._getContainer(url))
                );
                return Observable.forkJoin(observableBatch);
            }).catch(this.handleError);

   }

    public getContainer(id: string): Observable<Container> {
        return this._getContainer('/' + this._apiVersion + '/containers/' + id);
    }

    public setState(id: string, state: string): Observable<Operation> {
        return this.http.put(
            this._lxdBaseUrl + '/' + this._apiVersion + '/containers/' + id + '/state',
            JSON.stringify({
                'action': state, // State change action (stop, start, restart, freeze or unfreeze)
                'timeout': 30,   // A timeout after which the state change is considered as failed
                'force': true,   // Force the state change (it means killing the container)
                'stateful': false // (only valid for stop and start, defaults to false)
            })
        ).map(res => res.json()['metadata'])
            .catch(this.handleError);
    }

    public waitOperation(operationId: string): Observable<Operation> {
        return this.http.get(
            this._lxdBaseUrl + '/' + this._apiVersion + '/operations/' + operationId + '/wait'
        ).map((res: Response) => <Operation> res.json()['metadata'])
            .catch(this.handleError);
    }

    public exec(id: string, cmd: string[]): Observable<Operation> {
        return this.http.post(
            this._lxdBaseUrl + '/' + this._apiVersion + '/containers/' + id + '/exec',
            JSON.stringify({
                'command': cmd,
                'environment': {
                    'HOME': '/root',
                    'TERM': 'xterm',
                    'USER': 'root'
                },
                'wait-for-websocket': true,
                'interactive': true
            })
        ).map(res => res.json()['metadata'])
            .catch(this.handleError);
    }

    public operationWebsocket(operationId: string, secret: string): WebSocket {
        return new WebSocket([
            'wss://',
            this._lxdServer,
            '/',
            this._apiVersion,
            '/operations/',
            operationId,
            '/websocket?secret=',
            secret
        ].join(''));
    }

    public delete(id: string) {
        return this.http.delete(this._lxdBaseUrl + '/' + this._apiVersion + '/containers/' + id)
            .catch(this.handleError);
    }

    private _getContainer(url: string): Observable<Container> {
        return this.http.get(this._lxdBaseUrl + url)
            .map((res: Response) => <Container> res.json()['metadata'])
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    private loadServerConfig() {
        this._lxdServer = this.appConfig.LXDServer;
        this._protocole = this.appConfig.LXDProtocol;
        this._lxdBaseUrl = this._protocole + this._lxdServer;
    }
}
