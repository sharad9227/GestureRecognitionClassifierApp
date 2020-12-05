import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {AjaxService} from '../../services/ajaxService.service';
import { User } from '../../models/ValidUserComponent';
import {errorFormInput} from '../../interface/errorFormInput';
//modal import from https://sweetalert2.github.io/#download
import Swal from 'sweetalert2';
import { SharedService } from 'src/app/services/shared.service';
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
  responseData: User = new User();

  public error:errorFormInput ={ errCode:0, errMessage:'' };
  //creating private model for data security
  private submittedValues = this.userdata;

  popUpModalSuccess = Swal.mixin({
    toast:true,
    position:'center',
    timer: 2000,
    showCloseButton:false
  });
  popUpModalError =Swal.mixin({
    toast:true,
    position:'center',
    showCloseButton:true

  });


  /*primary role of class constructors in Angular is dependency injection */
  constructor(private route: ActivatedRoute,
              private router: Router,
              private loginService: AjaxService,
              private sharedService:SharedService) { }

  /*
  callback method that is invoked immediately after the default
  detector has checked the directives data bound properties for the first time
  and before any of the view or content children have been invoked.
  Invoked once when directive is initialized.
  */
  ngOnInit(): void {
    //isPageLoad=false;
  };

  /*
    Checks whether form is valid.
    If valid, persists the login details in LoginGesture table
    The router routes to homepage if success
    Returns appropriate error to user on failure
  */

  onSubmit(form: NgForm){
    this.submitted = true;
    if (form.valid)
    {
       this.loginService.loginUser(this.submittedValues).subscribe(data => {

            if (data != null && data.responseObj!=null)
            {
              if (data.responseObj.userId > 0 && (data.responseObj.user_first_name != null || data.responseObj.user_first_name !== ''))
              {
                this.responseData.id = data.responseObj.userId;
                this.responseData.userFirstName = data.responseObj.user_first_name;
                let configId=data.responseObj.configId;
                localStorage.setItem('configId',JSON.stringify(configId));
                localStorage.setItem('loggedInUser',this.responseData.userFirstName);
                this.popUpModalSuccess.fire({
                  icon: 'success',
                  title: 'Signed in successfully'
                })
                this.sharedService.openSideNavDrawer(true);
                this.router.navigate(['/home']);



              }
              else{
                this.error.errCode=data.status;
                this.error.errMessage=data.message;
                this.popUpModalError.fire({
                  icon: 'error',
                  title:  this.error.errMessage
                })
              }
            }
            else{
              this.error.errCode=data.status;
              this.error.errMessage=data.message;
              this.popUpModalError.fire({
                icon: 'error',
                title: this.error.errMessage
              })
            }
          },

           error => {
                this.error.errCode=error.error.status;
                this.popUpModalError.fire({
                  icon: 'error',
                  title: error.error.message
                })
           });
      }
//form not valid
          else{
            if(form.controls.email.value==undefined || form.controls.password.value==undefined)
            {
            this.popUpModalError.fire({
              icon: 'error',
              title: 'Please enter the required fields to sign in'
            })
          }

          }


}


}
