import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Image} from '../models/image';
import {Operation} from '../models/operation';
import {AppConfig} from './config.service';
import {LxdResponse} from '../models/lxdResponse';

@Injectable()
export class ImagesService {
    constructor(private conf: AppConfig, private http: Http) {
    }

    public getImages(): Observable<Observable<Image[]>> {
        let observableBatch = [];
        return this.http.get(`${this.conf.lxdBaseUrl}/images`)
            .map(res => {
                (res.json() as LxdResponse).metadata.forEach(
                    (url) => observableBatch.push(this._getImage(url))
                );
                return Observable.forkJoin(observableBatch);
            }).catch(this.handleError);

    }

    public getImage(id: string): Observable<Image> {
        return this._getImage(`/${this.conf.apiVersion}/images/${id}`);
    }


    public waitOperation(operationId: string): Observable<Operation> {
        return this.http.get(`${this.conf.lxdBaseUrl}/operations/${operationId}/wait`)
            .map((res: Response) => ((res.json() as LxdResponse).metadata as Operation))
            .catch(this.handleError);
    }

    public delete(id: string): Observable<Operation> {
        return this.http.delete(`${this.conf.lxdBaseUrl}/images/${id}`)
            .map((res: Response) => ((res.json() as LxdResponse).metadata as Operation))
            .catch(this.handleError);
    }

    public update(data: Image): Observable<Response> {
        return this.http.put(`${this.conf.lxdBaseUrl}/images/${data.fingerprint}`, data)
            .catch(this.handleError);
    }

    private _getImage(url: string): Observable<Image> {
        return this.http.get(`${this.conf.lxdServerUrl}${url}`)
            .map((res: Response) => new Image((res.json() as LxdResponse).metadata))
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
