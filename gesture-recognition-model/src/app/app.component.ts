import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from './models/ValidUserComponent';
import { SharedService } from './services/shared.service';

// Referred https://github.com/FortAwesome/angular-fontawesome

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private localStorage ;
  title = 'gesture-recognition-model';
  showSideNav=false;
  loggedInUser:string;
  constructor(
    private router: Router,
    private sharedService:SharedService
){}

ngOnInit():void{
  this.sharedService.closeSideNavDrawer().subscribe((res)=>{
    this.showSideNav=res;
  });
  this.sharedService.getUser().subscribe((res)=>{
    this.loggedInUser=res;
  });
}






logout() {
  localStorage.removeItem('loggedInUser');
   this.router.navigate(['/login']);
   this.sharedService.openSideNavDrawer(false);
   this.sharedService.setUser(null);
}
toggle(){
    this.sharedService.setMenuToggle();
}
home()
{
  this.router.navigate(['/home']);
}





}
