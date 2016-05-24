import {Component, ViewContainerRef}       from '@angular/core';
import {Router, ROUTER_DIRECTIVES, Routes} from '@angular/router';
import {HTTP_PROVIDERS}    from '@angular/http';
import {ContainerService}     from './services/container.service';
import {ContainersComponent} from './components/container/containers.component';
import {ContainerDetailComponent} from './components/container/container-detail.component';
import {HeaderComponent} from './menu.component';
import {Toasty, ToastyService} from 'ng2-toasty/ng2-toasty';
import {Modal, BS_MODAL_PROVIDERS} from 'angular2-modal/plugins/bootstrap';
import {AppConfig} from './services/config.service';
import {DialogRef} from 'angular2-modal/angular2-modal';
import {ImagesComponent} from './components/container/images.component';
import {ProfilesComponent} from './components/container/profiles.component';
import {ImagesService} from './services/images.service';
import {ProfilesService} from './services/profiles.service';


@Component({
    selector: 'lxd-app',
    viewProviders: [...BS_MODAL_PROVIDERS],
    templateUrl: 'assets/templates/app.component.html',
    directives: [
        ROUTER_DIRECTIVES,
        HeaderComponent,
        Toasty
    ],
    providers: [
        HTTP_PROVIDERS,
        ContainerService,
        ImagesService,
        ProfilesService
    ]
})

@Routes([
    {path: '/', component: ContainersComponent},
    {path: '/containers', component: ContainersComponent},
    {path: '/container/:id',  component: ContainerDetailComponent},
    {path: '/images',  component: ImagesComponent},
    {path: '/profiles',  component: ProfilesComponent}
])

export class AppComponent {
    title: string = 'LXD WebUI';

    constructor(private appConfig: AppConfig,
                private router: Router,
                private toastyService: ToastyService,
                public modal: Modal, viewContainer: ViewContainerRef) {
        modal.defaultViewContainer = viewContainer;
        appConfig.onChangeConfig.subscribe(e => this.checkLxdConnection());
        this.checkLxdConnection();
    }

    checkLxdConnection() {
        this.appConfig.checkLxdConnection()
            .subscribe(
                result => this.onSuccessConnection(result),
                err => this.onFailConnection(err)
            );
    }

    onSuccessConnection(result) {
        if (result.metadata && result.metadata.auth !== 'trusted') {
            this.openModalUntrusted();
            return;
        }
        this.toastyService.success({
            title: 'Connection established',
            timeout: 3000,
            theme: 'material'
        });
    }

    onFailConnection(error: string) {
        switch (error) {
            case 'net::ERR_INSECURE_RESPONSE' :
                this.openModalConnectionFailed();
                break;
            case 'NOT_LXD_SERVER' :
                this.openModalNotLxdServer();
                break;
            default :
                console.log(error);
                break;
        }
    }

    onModalConnectionOpened(dialog: DialogRef<any>) {
        dialog.result.then(
            this.onModalConnectionClickOk.bind(this),
            this.onModalConnectionClickCancel.bind(this
            ));
    }

    onModalConnectionClickOk(result) {
        this.checkLxdConnection();
        return;
    }

    onModalConnectionClickCancel() {

    }

    openModalConnectionFailed() {
        this.modal.confirm()
            .size('lg')
            .showClose(false)
            .isBlocking(true)
            .title('Security certificate is not trusted or Server isn\'t accessible')
            .message(`
<ul>
    <li>Please check if server is accessible</li>
    <li>Please check and validate the certificate</li>
    <li>Please check the configuration of <b>Access-Control-Allow-Origin</b></li>
    <li>Please check this URL : 
        <a href="${this.appConfig.lxdServerUrl}" target="_blank">${this.appConfig.lxdServerUrl}</a>
    </li>
</ul>
                    `)
            .open()
            .then(this.onModalConnectionOpened.bind(this));
    }

    openModalNotLxdServer() {
        this.modal.alert()
            .size('lg')
            .showClose(false)
            .isBlocking(true)
            .title('This is not a LXD server')
            .message(`
<ul>
    <li>The URL API response don't match with LXD response</li>
    <li>Please check this URL : 
        <a href="${this.appConfig.lxdServerUrl}" target="_blank">${this.appConfig.lxdServerUrl}</a>
    </li>
</ul>
                    `)
            .open();
    }

    openModalUntrusted() {
        this.modal.alert()
            .size('lg')
            .showClose(false)
            .isBlocking(true)
            .title('You arn\'t authenticated')
            .message(`
<ul>
    <li>Please check your client certificate in your brower</li>
    <li>Please check your client certificate is allowed in LXD server with :
        <code>lxc config trust list</code>
    </li>
</ul>
                    `)
            .open();
    }


}
