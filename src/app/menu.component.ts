import {Component, Input} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';

@Component({
    selector: 'demo-header',
    templateUrl: 'assets/templates/menu.component.html',
    directives: [
        CORE_DIRECTIVES
    ]
})

export class Header {
    public isCollapsed: boolean = true;
    @Input() title: string;
}
