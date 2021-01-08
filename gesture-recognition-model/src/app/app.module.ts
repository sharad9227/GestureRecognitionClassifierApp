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

import { User } from './models/ValidUserComponent';
import { UniversalGestureComponent } from './components/universal-gesture/universal-gesture.component';
 import { SharedService } from './services/shared.service';
import { RoutedSuccessComponent } from './components/routed-success/routed-success.component';
import {  FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
//imports from angular material
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule } from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
//youtube module for embedding videos
import {YouTubePlayerModule} from '@angular/youtube-player';
import {YoutubePlayerComponent} from './components/youtube-player-component/youtube-player-component.component';
import { CustomGestureComponent } from './components/custom-gesture/custom-gesture.component';
import {CdkTableModule} from '@angular/cdk/table';
import { premiumGestureConfig } from './models/premiumGestureConfig';
import { CustomGestureTestingComponent } from './components/custom-gesture-testing/custom-gesture-testing.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import {MatPaginatorModule} from '@angular/material/paginator';
@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LoginComponent,
    UniversalGestureComponent,
    RoutedSuccessComponent,
    YoutubePlayerComponent,
    CustomGestureComponent,
    CustomGestureTestingComponent,
    UserProfileComponent,
    AdminPanelComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatBadgeModule,
    appRoutingModule,
    MatExpansionModule,
    MatCardModule,
    MatSelectModule,
    MatSidenavModule,
    FontAwesomeModule,
    MatButtonToggleModule,
    MatIconModule,
    MatSlideToggleModule,
    YouTubePlayerModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule
  ],
  providers: [
    AjaxService,
     SharedService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIconPacks(fas);
  }

 }
