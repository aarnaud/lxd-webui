import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Profile} from '../../models/profile';
import {ProfilesService} from '../../services/profiles.service';
import {AppConfig} from '../../services/config.service';
import {ToastyService} from 'ng2-toasty/ng2-toasty';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'lxd-profiles',
    templateUrl: 'assets/templates/profiles.component.html'
})
export class ProfilesComponent implements OnInit {
    public profiles: Profile[];
    selectedProfile: Profile;

    ngOnInit(): any {
        this.getProfiles();
    }

    constructor(private conf: AppConfig,
                private router: Router,
                private profilesService: ProfilesService,
                private toastyService: ToastyService) {
        conf.onChangeConfig.subscribe( e => this.getProfiles() );
    }

    onSelect(profile: Profile) {
        // this.router.navigate(['profile', profile.name]);
    }

    public getProfiles(): void {
        this.profilesService.getProfiles()
            .subscribe((forkJoin: Observable<Profile[]>) => {
                    forkJoin.subscribe((profiles: Profile[]) => this.profiles = profiles);
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
