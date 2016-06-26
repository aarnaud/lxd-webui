import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Image} from '../../models/image';
import {ImagesService} from '../../services/images.service';
import {AppConfig} from '../../services/config.service';
import {ToastyService} from 'ng2-toasty/ng2-toasty';
import {Observable} from 'rxjs/Observable';
import {DateFormatPipe} from 'angular2-moment';
import {FileSizeFormatPipe} from '../../filters/fileSize';
import {ContainerService} from '../../services/container.service';

@Component({
    selector: 'lxd-images',
    templateUrl: 'assets/templates/images.component.html',
    pipes: [DateFormatPipe, FileSizeFormatPipe]
})
export class ImagesComponent implements OnInit {
    public images: Image[];
    selectedImage: Image;

    ngOnInit(): any {
        this.getImages();
    }

    constructor(private conf: AppConfig,
                private router: Router,
                private imagesService: ImagesService,
                private containerService: ContainerService,
                private toastyService: ToastyService) {
        conf.onChangeConfig.subscribe( e => this.getImages() );
    }

    onSelect(image: Image) {
        // this.router.navigate(['image', image.fingerprint]);
    }

    public getImages(): void {
        this.imagesService.getImages()
            .subscribe((forkJoin: Observable<Image[]>) => {
                    forkJoin.subscribe((images: Image[]) => this.images = images);
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

    applyChange(image: Image) {
        this.imagesService.update(image).subscribe(
            res => {
                if (res.json().status_code >= 400) {
                    this.toastyService.error(
                        this.getToastyOptions(res.json().err, res.json().status)
                    );
                } else {
                    this.toastyService.success(
                        this.getToastyOptions(undefined, res.json().status)
                    );
                }
            },
            err => this.toastyService.error(this.getToastyOptions(err))
        );
    }

    launchAction(image: Image, name: string) {
        let data = {
            'name': name,
            'source': {
                'type': 'image',
                'fingerprint': image.fingerprint
            }
        };
        this.containerService.create(data).subscribe(
            operation => this.waitOperation(operation.id),
            err => this.toastyService.error(this.getToastyOptions(err))
        );
    }

    deleteAction(image: Image) {
        this.imagesService.delete(image.fingerprint).subscribe(
            operation => this.waitOperation(operation.id),
            err => this.toastyService.error(this.getToastyOptions(err))
        );
    }

    waitOperation(operationId: string) {
        this.imagesService.waitOperation(operationId).subscribe(operation => {
                if (operation.status_code >= 400) {
                    this.toastyService.error(
                        this.getToastyOptions(operation.err, operation.status)
                    );
                } else {
                    this.toastyService.success(
                        this.getToastyOptions(undefined, operation.status)
                    );
                }
            },
            err => this.toastyService.error(this.getToastyOptions(err))
        );
    }
}
