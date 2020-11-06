import { Component } from '@angular/core';
import { Router } from '@angular/router';
// Referred https://github.com/FortAwesome/angular-fontawesome

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'gesture-recognition-model';
  constructor(
    private router: Router
){}
logout() {
  localStorage.removeItem('loggedInUser');
   this.router.navigate(['/login']);
}



}
