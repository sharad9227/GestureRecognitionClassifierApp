import { Component, HostListener, OnInit } from '@angular/core';
import { fonts } from '@fortawesome/fontawesome-free/';
@Component({
  selector: 'app-routed-success',
  templateUrl: './routed-success.component.html',
  styleUrls: ['./routed-success.component.css']
})
export class RoutedSuccessComponent implements OnInit {
fonts=fonts;
show=false;
openPanel=false;
loggedInUser;
  constructor() {

   }


  ngOnInit(): void {
    this.loggedInUser=localStorage.getItem('loggedInUser');
    console.log(this.show);
  }
  toggle() {

    this.show = !this.show;

  }

  getMouseClick(event)
  {
    //undefined for outside clicks and not specific button click or any element click

   if(event!=undefined && this.show && event.srcElement.type==undefined && event.srcElement.parentNode.nodeName!='svg' && event.srcElement.parentNode.nodeName!='FA-ICON')
   {
    this.show=false;

   }
  }

}
