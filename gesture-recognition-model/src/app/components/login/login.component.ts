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
  responseData: User = new User();
  //creating private model for data security
  private submittedValues = this.userdata;


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

            if (data != null)
            {
              if (data.responseObj.userId > 0 && (data.responseObj.user_first_name != null || data.responseObj.user_first_name !== ''))
              {
                this.responseData.id = data.responseObj.userId;
                this.responseData.userFirstName = data.responseObj.user_first_name;
                localStorage.setItem('loggedInUser',this.responseData.userFirstName);
                this.router.navigate(['/routed-success']);
                alert('Login Successful: Welcome: ' + this.responseData.userFirstName);
              }
              else{
                alert('The username or email is incorrect.Please check your credentials and try again.');
              }
            }
          },

           error => {
            alert('Internal server error with code ' + error.status + 'Message' + error.message);
           });







  }




}


}
