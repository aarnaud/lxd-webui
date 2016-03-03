import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';
import {Container} from './container';
import {ContainerDetailComponent} from './container-detail.component';
import {ContainerService} from './container.service';


@Component({
    selector: 'lxd-containers',
    template: `
        <ul class="containers">
            <li *ngFor="#container of containers"
                (click)="onSelect(container)"
                [class.selected]="container === selectedContainer">
                {{container.name}}
            </li>
        </ul>
        <container-detail [container]="selectedContainer"></container-detail>
    `,
    directives: [ContainerDetailComponent],

})
export class ContainersComponent implements OnInit {
    ngOnInit():any {
        this.getContainers();
        return undefined;
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
        this._containerService.getContainers().then(containers => this.containers = containers);
        console.log(this.containers)
    }
}