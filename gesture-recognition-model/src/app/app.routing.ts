import { Routes, RouterModule } from '@angular/router';
import { LoginSuccessComponent } from './components/login-success/login-success.component';

import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up-login/sign-up-login.component';


const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: SignUpComponent },
    { path: 'login-success', component: LoginSuccessComponent},
    // otherwise redirect to login
    { path: '', component: LoginComponent}
];

export const appRoutingModule = RouterModule.forRoot(routes);
