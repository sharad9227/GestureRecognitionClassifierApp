import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {AjaxService} from '../../services/ajaxService.service';
import { User } from '../../models/ValidUserComponent';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading = false;
  submitted = false;
  returnUrl: string;
  userdata = new User();
  //creating private model for data security
  private submittedValues = this.userdata;


  /*primary role of class constructors in Angular is dependency injection */
  constructor(private route: ActivatedRoute,
              private router: Router,
              private signUpService: AjaxService) { }

  /*
  callback method that is invoked immediately after the default
  detector has checked the directives data bound properties for the first time
  and before any of the view or content children have been invoked.
  Invoked once when directive is initialized.
  */
  ngOnInit(): void {
    //isPageLoad=false;
  };

  /*getting form submission data */
  // tslint:disable-next-line:typedef
  onSubmit(form: NgForm){
    this.submitted = true;




  }




}


