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
  loggedInUserType;
  routeUrl:string;
  vid1:string="NBk3LP6edDk";
  vid2:string="K1WnPvsjmHg";
  constructor(private renderer: Renderer2, public sharedService:SharedService ,private route:Router,private activatedRoute:ActivatedRoute) {
    this.routeUrl=route.url;

   }


  ngOnInit(): void {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
    this.loggedInUserType=JSON.parse(localStorage.getItem('userInformation')).userType;
    setTimeout(()=>{
      this.sharedService.openSideNavDrawer(true);
    },100)

    this.route.events.subscribe((res:any) =>{
      if(res.url==="/home")
    {
      this.show=true;
    }
    })
    if(this.routeUrl==="/home")
    {
      this.show=true;
    }
  }



  ngAfterViewInit()
  {
    this.sharedService.getMenuToggle().subscribe(()=>
    {
        this.sidePanel.toggle();
    });
    this.sidePanel.close();

  }


defaultClick()
{
  this.show=false;
  this.route.navigate(['universal-gesture'],{relativeTo:this.activatedRoute});
}

customClick()

{
  this.show=false;
  this.route.navigate(['custom-gesture/train'],{relativeTo:this.activatedRoute});
}

testClick()
{
  this.show=false;
  this.route.navigate(['custom-gesture/test'],{relativeTo:this.activatedRoute});
}

profileReq()
{
  this.show=false;
  this.route.navigate(['user-profile'],{relativeTo:this.activatedRoute});
}





getMouseClick(event)
  {
    //undefined for outside clicks and not specific button click or any element click

   if(event!=undefined &&  this.sidePanel.opened  &&   event.srcElement.type==undefined && (event.srcElement.parentNode!=null && event.srcElement.parentNode.innterText!="Load Video"))
   {
    this.sidePanel.toggle();

   }
  }
}
