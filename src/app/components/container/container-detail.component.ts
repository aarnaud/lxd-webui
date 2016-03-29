import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {Container} from '../../models/container';
import {ContainerService} from '../../services/container.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';

//FIXME: stop typescript error
declare var Terminal;

@Component({
    selector: 'container-detail',
    templateUrl: 'assets/templates/container-detail.component.html',
    providers: [ToastsManager]
})
export class ContainerDetailComponent implements OnInit {
    container: Container;

    constructor(private _containerService: ContainerService,
                private _routeParams: RouteParams,
                private toastr: ToastsManager) {
    }

    ngOnInit(): any {
        let id = this._routeParams.get('id');
        this._containerService.getContainer(id)
            .subscribe(
                container => this.container = container,
                err => this.toastr.error(err)
            );
    }

    stopAction() {
        this._containerService.setState(this.container.name, 'stop').subscribe(
            operation => this.waitOperation(operation.id),
            err => this.toastr.error(err)
        );
    }

    startAction() {
        this._containerService.setState(this.container.name, 'start').subscribe(
            operation => this.waitOperation(operation.id),
            err => this.toastr.error(err)
        );
    }

    restartAction() {
        this._containerService.setState(this.container.name, 'restart').subscribe(
            operation => this.waitOperation(operation.id),
            err => this.toastr.error(err)
        );
    }

    waitOperation(operationId: string) {
        this._containerService.waitOperation(operationId).subscribe(operation => {
            if (operation.status_code >= 400) {
                this.toastr.error(operation.err, operation.status);
            } else {
                this.toastr.success('', operation.status);
            }
            this.updateStatus();
        },
        err => this.toastr.error(err)
        );
    }

    execAction() {
        this._containerService.exec(this.container.name, ['bash']).subscribe(
            metadata => {
                var sock = this._containerService.operationWebsocket(
                    metadata.id, metadata.metadata.fds[0]
                );
                sock.onopen = function (e) {
                    var term = new Terminal({
                        cols: 160,
                        rows: 32,
                        useStyle: true,
                        screenKeys: false,
                        cursorBlink: false //To fix copy/paste in term
                    });

                    term.open(document.getElementById('console'));

                    term.on('data', function (data) {
                        sock.send(new Blob([data]));
                    });

                    sock.onmessage = function (msg) {
                        if (msg.data instanceof Blob) {
                            var reader = new FileReader();
                            reader.addEventListener('loadend', function () {
                                term.write(reader.result);
                            });
                            reader.readAsBinaryString(msg.data);
                        } else {
                            term.write(msg.data);
                        }

                    };

                    sock.onclose = function (msg) {
                        console.log('WebSocket closed');
                        term.destroy();
                    };
                    sock.onerror = function (err) {
                        console.error(err);
                    };
                };
            },
            err => this.toastr.error(err)
        );
    }

    deleteAction() {
        this._containerService.delete(this.container.name).subscribe(
            res => {
            },
            err => this.toastr.error(err)
        );
    }

    updateStatus() {
        this._containerService.getContainer(this.container.name).subscribe(
            res => this.container = res,
            err => this.toastr.error(err)
        );
    }
}
