import {Component} from '@angular/core';
import {BSModalContext} from 'angular2-modal/plugins/bootstrap/modal-context';
import {ModalComponent, DialogRef} from 'angular2-modal/angular2-modal';
import {Image} from '../../models/image';



export class ModalAddContainerData extends BSModalContext {
    constructor(public image: Image, public data: any) {
        super();
    }
}

@Component({
    selector: 'lxd-modal-content',
    styles: [`
        .custom-modal-container {
            padding: 15px;
        }
        .custom-modal-header {
            margin-top: -15px;
            margin-bottom: 40px;
        }
    `],
    template: `
        <div class="container-fluid custom-modal-container">
            <div class="row custom-modal-header">
                <div class="col-sm-12">
                    <h1>Create a container</h1>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-12">
                    <div>
                        <div class="form-group">
                            <label for="fingerprind">Image description</label>
                            <input 
                                type="text" 
                                [(ngModel)]="context.image.properties.description" 
                                class="form-control" 
                                id="fingerprind" 
                                readonly
                            >
                        </div>
                        <div class="form-group">
                            <label for="name">Container name</label>
                            <input
                                type="text"
                                [(ngModel)]="context.data.name"
                                class="form-control"
                                id="name"
                                placeholder="Container name(default generated name)"
                            >
                        </div>
                        <div class="pull-right">
                            <button (click)="onClickOk()" class="btn btn-primary">
                                Create container
                            </button>
                            <button (click)="onClickCancel()" class="btn btn-danger">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
})
export class ModalAddContainerComponent implements ModalComponent<ModalAddContainerData> {
    context: ModalAddContainerData;

    constructor(public dialog: DialogRef<ModalAddContainerData>) {
        this.context = dialog.context;
    }

    onClickOk(event) {
        this.dialog.close(true);
    }

    onClickCancel(event) {
        this.dialog.close();
    }


    beforeDismiss(): boolean {
        return true;
    }

    beforeClose(): boolean {
        return false;
    }
}
