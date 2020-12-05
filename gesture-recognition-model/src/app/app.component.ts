import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from './services/shared.service';

// Referred https://github.com/FortAwesome/angular-fontawesome

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'gesture-recognition-model';
  showSideNav=false;
  constructor(
    private router: Router,
    private sharedService:SharedService,
    private navService:SharedService
){}

ngOnInit():void{

    this.navService.closeSideNavDrawer().subscribe((res)=>{
      this.showSideNav=res;

    });

}



logout() {
  localStorage.removeItem('loggedInUser');
   this.router.navigate(['/login']);
   this.navService.openSideNavDrawer(false);
}
toggle(){
    this.sharedService.setMenuToggle();
}






}
