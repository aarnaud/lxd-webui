import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Container} from '../models/container';
import {Operation} from '../models/operation';
import {AppConfig} from './config.service';
import {LxdResponse} from '../models/lxdResponse';

@Injectable()
export class ContainerService {
    constructor(private conf: AppConfig, private http: Http) {}

    public getContainers(): Observable<Observable<Container[]>> {
        let observableBatch = [];
        return this.http.get(`${this.conf.lxdBaseUrl}/containers`)
            .map(res => {
                (res.json() as LxdResponse).metadata.forEach(
                    (url) => observableBatch.push(this._getContainer(url))
                );
                return Observable.forkJoin(observableBatch);
            }).catch(this.handleError);

    }

    public getContainer(id: string): Observable<Container> {
        return this._getContainer(`/${this.conf.apiVersion}/containers/${id}`);
    }

    public setState(id: string, state: string): Observable<Operation> {
        return this.http.put(`${this.conf.lxdBaseUrl}/containers/${id}/state`,
            JSON.stringify({
                'action': state, // State change action (stop, start, restart, freeze or unfreeze)
                'timeout': 30,   // A timeout after which the state change is considered as failed
                'force': true,   // Force the state change (it means killing the container)
                'stateful': false // (only valid for stop and start, defaults to false)
            })
        ).map(res => (res.json() as LxdResponse).metadata)
            .catch(this.handleError);
    }

    public waitOperation(operationId: string): Observable<Operation> {
        return this.http.get(`${this.conf.lxdBaseUrl}/operations/${operationId}/wait`)
            .map((res: Response) => ((res.json() as LxdResponse).metadata as Operation))
            .catch(this.handleError);
    }

    public exec(id: string, cmd: string[],
                width: number = 80, height: number = 25): Observable<Operation> {
        return this.http.post(`${this.conf.lxdBaseUrl}/containers/${id}/exec`,
            JSON.stringify({
                'command': cmd,
                'environment': {
                    'HOME': '/root',
                    'TERM': 'xterm',
                    'USER': 'root'
                },
                'wait-for-websocket': true,
                'interactive': true,
                'width': width,
                'height': height
            })
        ).map(res => (res.json() as LxdResponse).metadata)
            .catch(this.handleError);
    }

    public operationWebsocket(operationId: string, secret: string): WebSocket {
        return new WebSocket([
            'wss://',
            this.conf.lxdServer,
            '/',
            this.conf.apiVersion,
            '/operations/',
            operationId,
            '/websocket?secret=',
            secret
        ].join(''));
    }

    public delete(id: string) {
        return this.http.delete(`${this.conf.lxdBaseUrl}/containers/${id}`)
            .catch(this.handleError);
    }

    private _getContainer(url: string): Observable<Container> {
        return this.http.get(`${this.conf.lxdServerUrl}${url}`)
            .map((res: Response) => new Container((res.json() as LxdResponse).metadata))
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
