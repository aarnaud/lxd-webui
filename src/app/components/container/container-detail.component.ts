import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {Container} from './container';
import { ContainerService } from '../../services/container.service';

@Component({
    selector: 'container-detail',
    templateUrl: 'app/components/container/container-detail.component.html',
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
            .subscribe(container => this.container = container);
    }

    stopAction() {
        this._containerService.setState(this.container.name, 'stop').subscribe()
    }

    startAction() {
        this._containerService.setState(this.container.name, 'start').subscribe()
    }

    restartAction() {
        this._containerService.setState(this.container.name, 'restart').subscribe()
    }

    deleteAction() {
        this._containerService.delete(this.container.name).subscribe()
    }
}