import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Profile} from '../models/profile';
import {Operation} from '../models/operation';
import {AppConfig} from './config.service';
import {LxdResponse} from '../models/lxdResponse';

@Injectable()
export class ProfilesService {
    constructor(private conf: AppConfig, private http: Http) {
    }

    public getProfiles(): Observable<Observable<Profile[]>> {
        let observableBatch = [];
        return this.http.get(`${this.conf.lxdBaseUrl}/profiles`)
            .map(res => {
                (res.json() as LxdResponse).metadata.forEach(
                    (url) => observableBatch.push(this._getProfile(url))
                );
                return Observable.forkJoin(observableBatch);
            }).catch(this.handleError);

    }

    public getProfile(id: string): Observable<Profile> {
        return this._getProfile(`/${this.conf.apiVersion}/profiles/${id}`);
    }


    public waitOperation(operationId: string): Observable<Operation> {
        return this.http.get(`${this.conf.lxdBaseUrl}/operations/${operationId}/wait`)
            .map((res: Response) => ((res.json() as LxdResponse).metadata as Operation))
            .catch(this.handleError);
    }

    public delete(id: string) {
        return this.http.delete(`${this.conf.lxdBaseUrl}/profiles/${id}`)
            .catch(this.handleError);
    }

    private _getProfile(url: string): Observable<Profile> {
        return this.http.get(`${this.conf.lxdServerUrl}${url}`)
            .map((res: Response) => new Profile((res.json() as LxdResponse).metadata))
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
