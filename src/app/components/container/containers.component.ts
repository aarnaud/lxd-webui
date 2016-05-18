import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router-deprecated';
import {Container} from '../../models/container';
import {ContainerService} from '../../services/container.service';
import {Observable}     from 'rxjs/Observable';
import {AppConfig} from '../../services/config.service';
import {ToastyService} from 'ng2-toasty/ng2-toasty';

@Component({
    selector: 'lxd-containers',
    templateUrl: 'assets/templates/containers.component.html'
})
export class ContainersComponent implements OnInit {
    public title = 'LXD WebUI';
    public containers: Container[];
    selectedContainer: Container;

    ngOnInit(): any {
        this.getContainers();
    }

    constructor(private appConfig: AppConfig, private _router: Router,
                private _containerService: ContainerService,
                private toastyService: ToastyService) {
        appConfig.onChangeConfig.subscribe( e => this.getContainers() );
    }

    onSelect(container: Container) {
        // this.selectedContainer = container;
        let link = ['ContainerDetail', {id: container.name}];
        this._router.navigate(link);
    }

    public getContainers(): void {
        this._containerService.getContainers()
            .subscribe((forkJoin: Observable<Container[]>) => {
                forkJoin.subscribe((containers: Container[]) => this.containers = containers);
            },
            err => this.toastyService.error(this.getToastyOptions(err)));
    }

    public isRunning(container: Container): boolean {
        return (container.status === 'Running');
    }

    public isStopped(container: Container): boolean {
        return (container.status === 'Stopped');
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
