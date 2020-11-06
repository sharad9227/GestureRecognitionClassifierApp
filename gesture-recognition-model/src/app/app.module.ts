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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
//Material Inputs

import {MatInputModule} from '@angular/material/input';
import {MatButtonModule } from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { User } from './models/ValidUserComponent';
import { LoginSuccessComponent } from './components/login-success/login-success.component';
 import { DynamicScriptLoaderService } from './services/dynamicScriptLoadService.service';
import { RoutedSuccessComponent } from './components/routed-success/routed-success.component';
import {  FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import {MatIconModule} from '@angular/material/icon';
//youtube module for embedding videos
import {YouTubePlayerModule} from '@angular/youtube-player';
import {YoutubePlayerComponent} from './components/youtube-player-component/youtube-player-component.component'
@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LoginComponent,
    LoginSuccessComponent,
    RoutedSuccessComponent,
    YoutubePlayerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    HttpClientModule,
    appRoutingModule,
    MatExpansionModule,
    MatSidenavModule,
    FontAwesomeModule,
    MatButtonToggleModule,
    MatIconModule,
    YouTubePlayerModule
  ],
  providers: [AjaxService,
     User,
     DynamicScriptLoaderService,
     //referred  https://www.npmjs.com/package/angular-youtube-player single line

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIconPacks(fas);
  }

 }
