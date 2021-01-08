import { Routes, RouterModule } from '@angular/router';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { CustomGestureTestingComponent } from './components/custom-gesture-testing/custom-gesture-testing.component';
import { CustomGestureComponent } from './components/custom-gesture/custom-gesture.component';
import { UniversalGestureComponent } from './components/universal-gesture/universal-gesture.component';

import { LoginComponent } from './components/login/login.component';
import { RoutedSuccessComponent } from './components/routed-success/routed-success.component';
import { SignUpComponent } from './components/sign-up-login/sign-up-login.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';


const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: SignUpComponent },
    { path: 'universal-gesture', component: UniversalGestureComponent},

    {
      path:'home',
    component: RoutedSuccessComponent,
    children:[
      { path: 'universal-gesture', component: UniversalGestureComponent},
      { path:'custom-gesture/train',component: CustomGestureComponent},
      { path:'custom-gesture/test',component:CustomGestureTestingComponent},
      { path:'user-profile',component:UserProfileComponent},
    ]
  },
    { path:'custom-gesture/train',component: CustomGestureComponent},
    { path:'custom-gesture/test',component:CustomGestureTestingComponent},


    { path:'admin',component:AdminPanelComponent},




    // otherwise redirect to login
    { path: 'login', component: LoginComponent}


];

export const appRoutingModule = RouterModule.forRoot(routes);
