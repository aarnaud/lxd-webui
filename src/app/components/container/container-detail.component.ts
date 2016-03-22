import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {Container} from './container';
import { ContainerService } from '../../services/container.service';
//FIXME: stop typescript error
declare var Materialize;
declare var Terminal;

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
        this._containerService.setState(this.container.name, 'stop').subscribe(
            operation => this.waitOperation(operation.id)
        )
    }

    startAction() {
        this._containerService.setState(this.container.name, 'start').subscribe(
            operation => this.waitOperation(operation.id)
        )
    }

    restartAction() {
        this._containerService.setState(this.container.name, 'restart').subscribe(
            operation => this.waitOperation(operation.id)
        )
    }

    waitOperation(operationId: string){
        this._containerService.waitOperation(operationId).subscribe(operation => {
            if(operation.status_code >= 400){
                Materialize.toast(operation.status+': '+operation.err, 4000)
            } else {
                Materialize.toast(operation.status, 4000)
            }
            this.updateStatus()
        })
    }

    execAction(){
        this._containerService.exec(this.container.name, ["top"]).subscribe(
            metadata => {
                var sock = this._containerService.operationWebsocket(metadata.id, metadata.metadata.fds[0]);
                sock.onopen = function (e) {
                    var term = new Terminal({
                        cols: 80,
                        rows: 24,
                        useStyle: true,
                        screenKeys: false
                    });

                    term.open(document.getElementById("console"));

                    term.on('data', function(data) {
                        sock.send(data);
                    });

                    sock.onmessage = function(msg) {
                        term.write(msg.data);
                    };

                    sock.onclose = function(msg) {
                        term.destroy();
                    };
                };
            },
            err => Materialize.toast('Error: '+err, 4000)
        )
    }

    deleteAction() {
        this._containerService.delete(this.container.name).subscribe(
            res => {},
            err => Materialize.toast('Error: '+err, 4000)
        )
    }

    updateStatus(){
        this._containerService.getContainer(this.container.name).subscribe(res => this.container = res)
    }
}