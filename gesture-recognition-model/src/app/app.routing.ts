import { Routes, RouterModule } from '@angular/router';
import { CustomGestureComponent } from './components/custom-gesture/custom-gesture.component';
import { LoginSuccessComponent } from './components/login-success/login-success.component';

import { LoginComponent } from './components/login/login.component';
import { RoutedSuccessComponent } from './components/routed-success/routed-success.component';
import { SignUpComponent } from './components/sign-up-login/sign-up-login.component';


const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: SignUpComponent },
    { path: 'login-success', component: LoginSuccessComponent},

    {
      path:'home',
    component: RoutedSuccessComponent,
    children:[
      { path: 'login-success', component: LoginSuccessComponent},
      { path:'custom-gesture',component: CustomGestureComponent}
    ]

  },
    { path:'custom-gesture',component: CustomGestureComponent},
    // otherwise redirect to login
    { path: '', component: LoginComponent}


];

export const appRoutingModule = RouterModule.forRoot(routes);
