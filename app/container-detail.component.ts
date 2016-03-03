import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {Container} from './container';
import { ContainerService } from './container.service';

@Component({
    selector: 'container-detail',
    templateUrl: 'app/container-detail.component.html',
})
export class ContainerDetailComponent implements OnInit{
    container: Container;

    constructor(
        private _containerService: ContainerService,
        private _routeParams: RouteParams) {
    }

    ngOnInit():any {
        let id = this._routeParams.get('id');
        this._containerService.getContainer(id)
            .then(container => this.container = container);
    }

    goBack() {
        window.history.back();
    }
}