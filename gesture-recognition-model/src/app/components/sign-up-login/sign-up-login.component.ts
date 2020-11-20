import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/ValidUserComponent';
import {AjaxService} from '../../services/ajaxService.service';
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
            alert('Internal server error with code ' + error.status + 'Message' + error.message);
               });
         }
         else {
              alert('password and confirm password are not same');
         }
     }
     else{
       alert('There are errors in the form, you cannot submit');
     }
  }






}








