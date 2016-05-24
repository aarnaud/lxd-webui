import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
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
    public containers: Container[];
    selectedContainer: Container;

    ngOnInit(): any {
        this.getContainers();
    }

    constructor(private appConfig: AppConfig,
                private router: Router,
                private containerService: ContainerService,
                private toastyService: ToastyService) {
        appConfig.onChangeConfig.subscribe( e => this.getContainers() );
    }

    onSelect(container: Container) {
        this.router.navigate(['container', container.name]);
    }

    public getContainers(): void {
        this.containerService.getContainers()
            .subscribe((forkJoin: Observable<Container[]>) => {
                forkJoin.subscribe((containers: Container[]) => this.containers = containers);
            },
            err => this.toastyService.error(this.getToastyOptions(err)));
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
