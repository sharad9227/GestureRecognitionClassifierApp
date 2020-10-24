import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignUpComponent } from './components/sign-up-login/sign-up-login.component';
import { LoginComponent } from './components/login/login.component';
import {AjaxService} from './services/ajaxService.service';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { appRoutingModule } from './app.routing';

//Material Inputs

import {MatInputModule} from '@angular/material/input';
import {MatButtonModule } from '@angular/material/button';
import { User } from './models/ValidUserComponent';
import { LoginSuccessComponent } from './components/login-success/login-success.component';
 import { DynamicScriptLoaderService } from './services/dynamicScriptLoadService.service';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LoginComponent,
    LoginSuccessComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    HttpClientModule,
    appRoutingModule
  ],
  providers: [AjaxService, User, DynamicScriptLoaderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
