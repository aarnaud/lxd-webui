import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';
import {Container} from '../../models/container';
import {ContainerDetailComponent} from './container-detail.component';
import {ContainerService} from '../../services/container.service';
import {Observable}     from 'rxjs/Observable';

@Component({
    selector: 'lxd-containers',
    templateUrl: 'assets/templates/containers.component.html',
})
export class ContainersComponent implements OnInit {
    public title = 'LXD WebUI';
    public containers: Container[];
    selectedContainer: Container;

    ngOnInit(): any {
        this.getContainers();
    }

    constructor(private _router: Router,
                private _containerService: ContainerService) {
    }

    onSelect(container: Container) {
        //this.selectedContainer = container;
        let link = ['ContainerDetail', {id: container.name}];
        this._router.navigate(link);
    }

    public getContainers(): void {
        this._containerService.getContainers()
            .subscribe((forkJoin: Observable<Container[]>) => {
                forkJoin.subscribe((containers: Container[]) => this.containers = containers);
            });
    }


    public isRunning(container: Container) {
        return (container.status === 'Running');
    }
}
