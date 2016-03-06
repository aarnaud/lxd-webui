import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';
import {Container} from './container';
import {ContainerDetailComponent} from './container-detail.component';
import {ContainerService} from './container.service';
import {Observable}     from 'rxjs/Observable';

@Component({
    selector: 'lxd-containers',
    template: `
        <ul class="containers">
            <li *ngFor="#container of containers"
                (click)="onSelect(container)"
                [class.selected]="container === selectedContainer">
                {{container.name}} ( {{container.status}} )
            </li>
        </ul>
    `,
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
}