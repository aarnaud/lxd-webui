import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import {Container} from '../components/container/container'
import {Operation} from "../components/container/operation";

@Injectable()
export class ContainerService {
    constructor (private http: Http) {}

    private _lxdServer = 'https://127.0.0.1:8443';  // URL to web api
    private _apiVersion = '1.0';  // URL to web api

    private handleError (error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error.json());
        return Observable.throw(error.json().error || 'Server error');
    }

    getContainers(): Observable<Observable<Container[]>> {
        let observableBatch = [];
        return this.http.get(this._lxdServer+"/"+this._apiVersion+"/containers")
            .map(res => {
                res.json()['metadata'].forEach((url) => observableBatch.push(this._getContainer(url)));
                return Observable.forkJoin(observableBatch);
            }).catch(this.handleError);

    }
    getContainer(id: string): Observable<Container> {
        return this._getContainer("/"+this._apiVersion+"/containers/"+id);
    }

    _getContainer(url: string): Observable<Container> {
        return this.http.get(this._lxdServer+url)
            .map((res: Response) => <Container> res.json()['metadata'])
            .catch(this.handleError);
    }

    setState(id:string, state: string): Observable<any>{
        return this.http.put(this._lxdServer+"/"+this._apiVersion+"/containers/"+id+"/state", JSON.stringify({
            "action": state,        // State change action (stop, start, restart, freeze or unfreeze)
            "timeout": 30,          // A timeout after which the state change is considered as failed
            "force": true,          // Force the state change (currently only valid for stop and restart where it means killing the container)
            "stateful": false        // Whether to store or restore runtime state before stopping or startiong (only valid for stop and start, defaults to false)
        })).catch(this.handleError);
    }

    waitOperation(operationUrl: string): Observable<Operation>{
        return this.http.get(this._lxdServer+operationUrl+'/wait')
            .map((res: Response) => <Operation> res.json()['metadata'])
            .catch(this.handleError);
    }

    delete(id:string){
        return this.http.delete(this._lxdServer+"/"+this._apiVersion+"/containers/"+id)
            .catch(this.handleError);
    }
}