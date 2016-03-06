import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import {Container} from './container'

@Injectable()
export class ContainerService {
    constructor (private http: Http) {}

    private _lxdServer = 'http://192.168.57.75';  // URL to web api
    private _apiVersion = '1.0';  // URL to web api

    private handleError (error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error.json());
        return Observable.throw(error.json().error || 'Server error');
    }

    getContainers(): Observable {
        let observableBatch = [];
        return this.http.get(this._lxdServer+"/"+this._apiVersion+"/containers")
            .map(res => {
                res.json()['metadata'].forEach((url) => observableBatch.push(this._get(url)));
                return Observable.forkJoin(observableBatch);
            }).catch(this.handleError);

    }
    getContainer(id: string): Observable {
        return this._get("/"+this._apiVersion+"/containers/"+id);
    }

    _get(url): Observable {
        return this.http.get(this._lxdServer+url)
            .map((res: Response) => <Container[]> res.json()['metadata'])
            .catch(this.handleError);
    }

    setState(id:string, state: string){
        return this.http.put(this._lxdServer+"/"+this._apiVersion+"/containers/"+id+"/state", JSON.stringify({
            "action": state,        // State change action (stop, start, restart, freeze or unfreeze)
            "timeout": 30,          // A timeout after which the state change is considered as failed
            "force": true,          // Force the state change (currently only valid for stop and restart where it means killing the container)
            "stateful": false        // Whether to store or restore runtime state before stopping or startiong (only valid for stop and start, defaults to false)
        })).catch(this.handleError);
    }

    delete(id:string){
        return this.http.delete(this._lxdServer+"/"+this._apiVersion+"/containers/"+id)
            .catch(this.handleError);
    }
}