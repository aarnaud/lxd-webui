import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {Container} from './container';
import { ContainerService } from '../../services/container.service';

@Component({
    selector: 'container-detail',
    templateUrl: 'assets/templates/container-detail.component.html',
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
        this._containerService.setState(this.container.name, 'stop').subscribe(res => {
            this.waitOperation(res.json().operation)
        })
    }

    startAction() {
        this._containerService.setState(this.container.name, 'start').subscribe(res => {
            this.waitOperation(res.json().operation)
        })
    }

    restartAction() {
        this._containerService.setState(this.container.name, 'restart').subscribe(res => {
            this.waitOperation(res.json().operation)
        })
    }

    waitOperation(operationUrl: string){
        this._containerService.waitOperation(operationUrl).subscribe(operation => {
            if(operation.status_code >= 400){
                Materialize.toast(operation.status+': '+operation.err, 4000)
            } else {
                Materialize.toast(operation.status, 4000)
            }
            this.updateStatus()
        })
    }

    deleteAction() {
        this._containerService.delete(this.container.name).subscribe()
    }

    updateStatus(){
        this._containerService.getContainer(this.container.name).subscribe(res => this.container = res)
    }
}