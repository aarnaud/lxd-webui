import { RouterConfig } from '@angular/router';
import { ContainersComponent } from './components/container/containers.component';
import {ContainerDetailComponent} from './components/container/container-detail.component';
import {ImagesComponent} from './components/container/images.component';
import {ProfilesComponent} from './components/container/profiles.component';

export const routes: RouterConfig = [
    {path: '', component: ContainersComponent},
    {path: 'containers', component: ContainersComponent},
    {path: 'container/:id',  component: ContainerDetailComponent},
    {path: 'images',  component: ImagesComponent},
    {path: 'profiles',  component: ProfilesComponent},
    { path: '**',    component: ContainersComponent }
];

// Example asyncRoutes is needed for our webpack-toolkit
// to allow us to resolve the component correctly
// export const asyncRoutes = {
//     'About': require('es6-promise-loader!./about')
// };
