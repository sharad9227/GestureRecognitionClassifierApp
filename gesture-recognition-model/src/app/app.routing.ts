import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up-login/sign-up-login.component';


const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: SignUpComponent },

    // otherwise redirect to login
    { path: '', component: LoginComponent}
];

export const appRoutingModule = RouterModule.forRoot(routes);
