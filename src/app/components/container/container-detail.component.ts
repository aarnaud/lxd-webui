import {Component} from '@angular/core';
import {OnActivate, Router, RouteSegment} from '@angular/router';
import {Container} from '../../models/container';
import {ContainerService} from '../../services/container.service';
import {ToastyService} from 'ng2-toasty/ng2-toasty';

// FIXME: stop typescript error
declare var Terminal;

@Component({
    selector: 'lxd-container-detail',
    templateUrl: 'assets/templates/container-detail.component.html'
})
export class ContainerDetailComponent implements OnActivate {
    container: Container;

    constructor(private containerService: ContainerService,
                private router: Router,
                private toastyService: ToastyService) {
    }

    routerOnActivate(curr: RouteSegment): void {
        let id = curr.getParam('id');
        this.containerService.getContainer(id)
            .subscribe(
                container => this.container = container,
                err => this.toastyService.error(this.getToastyOptions(err))
            );
    }

    stopAction() {
        this.containerService.setState(this.container.name, 'stop').subscribe(
            operation => this.waitOperation(operation.id),
            err => this.toastyService.error(this.getToastyOptions(err))
        );
    }

    startAction() {
        this.containerService.setState(this.container.name, 'start').subscribe(
            operation => this.waitOperation(operation.id),
            err => this.toastyService.error(this.getToastyOptions(err))
        );
    }

    restartAction() {
        this.containerService.setState(this.container.name, 'restart').subscribe(
            operation => this.waitOperation(operation.id),
            err => this.toastyService.error(this.getToastyOptions(err))
        );
    }

    waitOperation(operationId: string) {
        this.containerService.waitOperation(operationId).subscribe(operation => {
            if (operation.status_code >= 400) {
                this.toastyService.error(this.getToastyOptions(operation.err, operation.status));
            } else {
                this.toastyService.success(this.getToastyOptions(undefined, operation.status));
            }
            this.updateStatus();
        },
        err => this.toastyService.error(this.getToastyOptions(err))
        );
    }

    execAction() {
        
        let width = document.getElementById("console").offsetWidth;
        // On Ubuntu 16.04,
        // term has with of 572 pixel and height of 314 pixel, and its geometry is 80x24, based on xwininfo
        const TWIDTH = 572;
        const THEIGHT = 314;
        const TCOLS = 80;
        const TROWS = 24;
        let height = width/(TWIDTH/THEIGHT); // Display aspect ratio;
        let termCols = Number((width/(TWIDTH/TCOLS)).toFixed(0));
        let termRows = Number((height/(THEIGHT/TROWS)).toFixed(0));

        this.containerService.exec(this.container.name, ['bash'], termCols, termRows).subscribe(
            metadata => {
                let sock = this.containerService.operationWebsocket(
                    metadata.id, metadata.metadata.fds[0]
                );
                sock.onopen = function (e) {
                    let term = new Terminal({
                        cols: termCols,
                        rows: termRows,
                        useStyle: true,
                        screenKeys: false,
                        cursorBlink: false // To fix copy/paste in term
                    });

                    term.open(document.getElementById('console'));

                    term.on('data', function (data) {
                        sock.send(new Blob([data]));
                    });

                    sock.onmessage = function (msg) {
                        if (msg.data instanceof Blob) {
                            let reader = new FileReader();
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
            err => this.toastyService.error(this.getToastyOptions(err))
        );
    }

    deleteAction() {
        this.containerService.delete(this.container.name).subscribe(
            res => {
            },
            err => this.toastyService.error(this.getToastyOptions(err))
        );
    }

    updateStatus() {
        this.containerService.getContainer(this.container.name).subscribe(
            res => this.container = res,
            err => this.toastyService.error(this.getToastyOptions(err))
        );
    }

    getToastyOptions(message: string = '', title: string = '') {
        return {
            title: title,
            msg: message,
            timeout: 3000,
            theme: 'material'
        };
    }
}
