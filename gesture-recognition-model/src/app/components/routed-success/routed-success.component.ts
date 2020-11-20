import { Component, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { fonts } from '@fortawesome/fontawesome-free/';
import threeFingersUpGesture from 'src/app/models/gestureSet/threeUpGesture';
import {SharedService} from '../../services/shared.service'
@Component({
  selector: 'app-routed-success',
  templateUrl: './routed-success.component.html',
  styleUrls: ['./routed-success.component.css']
})
export class RoutedSuccessComponent implements OnInit {
  @ViewChild('navbar')  sidePanel :MatSidenav;
  fonts=fonts;
  show=false;
  openPanel=false;
  loggedInUser;

  constructor(private renderer: Renderer2, public navService:SharedService ,private route:Router,private activatedRoute:ActivatedRoute) {
   // this.renderer.setStyle(document.body, 'background-image', ' linear-gradient(to top, #a8edea 0%, #fed6e3 100%) !important');
   }


  ngOnInit(): void {
    this.loggedInUser=localStorage.getItem('loggedInUser');

    console.log(this.show);
  }





  ngAfterViewInit()
  {
    this.navService.getMenuToggle().subscribe(()=>
    {
        this.sidePanel.toggle();
    });
    this.sidePanel.close();

  }


defaultClick()
{
      this.route.navigate(['login-success'],{relativeTo:this.activatedRoute});
}

customClick()

{
  this.route.navigate(['custom-gesture'],{relativeTo:this.activatedRoute});
}



}
