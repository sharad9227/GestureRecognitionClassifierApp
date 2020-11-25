import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/ValidUserComponent';
import {AjaxService} from '../../services/ajaxService.service';

import Swal from 'sweetalert2';
import { errorFormInput } from 'src/app/interface/errorFormInput';
@Component({
  selector: 'app-sign-up-login',
  templateUrl: './sign-up-login.component.html',
  styleUrls: ['./sign-up-login.component.css']
})
export class SignUpComponent implements OnInit {

  loading = false;
  submitted = false;
  responseData: Object = new Object();
  userdata = new User();
  //creating private model for data security
  private submittedValues = this.userdata;
  public error:errorFormInput ={ errCode:0, errMessage:'' };
  //popup
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

//  submittedValues :Object = { password :'', confirmPassword:''};
  constructor(
              private route: ActivatedRoute,
              private router: Router,
              private signUpService: AjaxService) {}

  ngOnInit(): void {}

  /*getting form submission data */

  // tslint:disable-next-line:typedef
  onSubmit(form: NgForm)
  {
   if (form.valid && form.value.acceptedTerms)
      {
         if ( this.submittedValues.password ===  this.submittedValues.confirmPassword)
         {
             alert('true:form valid');
             this.submittedValues.userType = 'Normal';
             this.signUpService.signUpUser(this.submittedValues).subscribe(data => {
             // this.responseData = data;
              alert(data.message);
              if (data != null && data.status === 200)
              {

                this.router.navigate(['/login']);
              }
              else{
                alert('error with code ' + data.status + 'Message' + data.message);
              }
          },
          error => {

                this.error.errCode=error.error.status;

                this.popUpModalError.fire({
                  icon: 'error',
                  title: error.error.message
                })



           })
         }
         else {
          this.error.errMessage="Password and Confirm password do not match";
          this.popUpModalError.fire({
            icon: 'error',
            title: this.error.errMessage
          })
             // alert('password and confirm password are not same');
         }
     }
     else{
        //form control invalid
        let invalidControls= form.controls;
        let invalidFields=[];
        for(let item in invalidControls)
        {
          if(invalidControls[item].status=="INVALID")
            {
              invalidFields.push(item);
           }
        }


       this.error.errMessage='Please fill the fields : ' + invalidFields +' fields and try again.'
       this.popUpModalError.fire({
        icon: 'error',
        title: this.error.errMessage
       })

     }
  }






}








