import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';
import {Container} from './container';
import {ContainerDetailComponent} from './container-detail.component';
import {ContainerService} from '../../services/container.service';
import {Observable}     from 'rxjs/Observable';

@Component({
    selector: 'lxd-containers',
    templateUrl: 'app/components/container/containers.component.html',
})
export class ContainersComponent implements OnInit {
    ngOnInit():any {
        this.getContainers();
    }
    public title = 'LXD WebUI';
    public containers: Container[];
    selectedContainer: Container;

    constructor(
        private _router: Router,
        private _containerService: ContainerService) {
    }

    onSelect(container: Container) {
        //this.selectedContainer = container;
        let link = ['ContainerDetail', { id: container.name }];
        this._router.navigate(link);
    }

    private getContainers():void {
        this._containerService.getContainers()
            .subscribe((forkJoin: Observable) => forkJoin.subscribe((containers: Container[]) => this.containers = containers));
    }


    isRunning(container: Container) {
        return (container.status == "Running")
    }
    setClasses(container: Container) {
        let classes =  {
            "label": true,
            "pull-right": true,
            "label-success": (container.status == "Running"),
            "label-default": (container.status == "Stopped")
        };
        console.log(classes);
        return classes;
    }
}