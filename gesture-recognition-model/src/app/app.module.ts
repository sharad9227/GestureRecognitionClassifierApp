import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignUpComponent } from './components/sign-up-login/sign-up-login.component';
import { LoginComponent } from './components/login/login.component';

import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { appRoutingModule } from './app.routing';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    appRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
