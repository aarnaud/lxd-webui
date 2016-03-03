import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import {Container} from './container'

@Injectable()
export class ContainerService {
    constructor (private http: Http) {}

    private _lxdServer = 'https://127.0.0.1:8443';  // URL to web api

    getContainers() {
        // Async with promise
        var containersUrl = this.http.get(this._lxdServer+"/1.0/containers").toPromise()
            .then(function (data) {
                if(data.json().status_code == 200){
                    return data.json().metadata;
                }
            });

        var self = this;
        return containersUrl.then(function(urls){
            return urls.map(function(url){
                return self._get(self._lxdServer+url)
            })
        });

        return Promise.resolve(CONTAINERS)

    }
    getContainer(id: string) {
        return Promise.resolve(CONTAINERS).then(
            heroes => heroes.filter(container => container.name === id)[0]
        );
    }

    private handleError (error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    _get(url){
        return this.http.get(url).toPromise()
            .then(function (data) {
                if(data.json().status_code == 200){
                    return data.json().metadata
                }
            })
    }
}


var CONTAINERS: Container[] = [
    { "name": "Mr. Nice" },
    { "name": "Narco" },
    { "name": "Bombasto" },
    { "name": "Celeritas" },
    { "name": "Magneta" },
    { "name": "RubberMan" },
    { "name": "Dynama" },
    { "name": "Dr IQ" },
    { "name": "Magma" },
    { "name": "Tornado" }
];