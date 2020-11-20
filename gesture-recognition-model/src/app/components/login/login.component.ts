import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {AjaxService} from '../../services/ajaxService.service';
import { User } from '../../models/ValidUserComponent';
import {errorFormInput} from '../../interface/errorFormInput';
//modal import from https://sweetalert2.github.io/#download
import Swal from 'sweetalert2';
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
              private loginService: AjaxService) { }

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
                localStorage.setItem('loggedInUser',this.responseData.userFirstName);
                this.popUpModalSuccess.fire({
                  icon: 'success',
                  title: 'Signed in successfully'
                })
                this.router.navigate(['/home']);



              }
              else{
                this.error.errCode=data.status;
                this.error.errMessage=data.message;
                this.popUpModalError.fire({
                  icon: 'error',
                  title: 'Some Error occurred'+ this.error.errMessage
                })
              }
            }
            else{
              this.error.errCode=data.status;
              this.error.errMessage=data.message;
              this.popUpModalError.fire({
                icon: 'error',
                title: 'Some Error occurred'+ this.error.errMessage
              })

            }


          },

           error => {
            alert('Internal server error with code ' + error.status + 'Message' + error.message);
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
