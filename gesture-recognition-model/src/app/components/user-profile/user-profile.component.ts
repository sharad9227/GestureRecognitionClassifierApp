import { formatCurrency } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { AjaxService } from 'src/app/services/ajaxService.service';
import { User } from '../../models/ValidUserComponent';
import { pairwise, take } from 'rxjs/operators';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userdata = new User();
  //creating private model for data security
  private submittedValues = this.userdata;

   userStatus:String="Normal User :: Switch to Premium Access";
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
  userInformation ={'userId':0};
  toggleControl = new FormControl();
  userProfileChangesTracker = {
    userFirstName:'',
    userLastName:''
  };
  userChangesSubmissionValues= {
    'userId':0,
    userFirstName:'',
    userLastName:'',
    reqStatus:false
  };
  @ViewChild('toggleChecked') toggleChecked: MatSlideToggle;
  // @ViewChild('userProfile', { static: true }) ngForm: NgForm;
  constructor(private userProfileService: AjaxService,public elementRef: ElementRef) { }

  ngOnInit(): void {
    this.userInformation=JSON.parse(localStorage.getItem("userInformation"));
    this.userProfileService.getUserDetails(this.userInformation.userId).subscribe(data=>{
      if (data != null && data.responseObj!=null)
      {
          this.userdata=data.responseObj;
          this.userProfileChangesTracker.userFirstName=data.responseObj.userFirstName;
          this.userProfileChangesTracker.userLastName=data.responseObj.userLastName;

          if(data.responseObj.userType==="Special")
          {
            this.userStatus="Premium Access Enabled";
            this.toggleChecked.toggle();
          }
      }
    },
    error => {
      alert('Error occured'+error);
 })

    //this.elementRef.nativeElement.querySelector('#first_name').addEventListener('change', this.saveFile.bind(this));

  }

       public onSubmit(userProfile: NgForm)
           {
             if(userProfile.valid)
             {
              let changes=[],first=false,last=false;
                if(this.userdata.userFirstName!= this.userProfileChangesTracker.userFirstName)
               {
                   first=true;
                   changes.push('userFirstName');

               }
                if(this.userdata.userLastName !=this.userProfileChangesTracker.userLastName)
                {
                   changes.push('userLastName')
                }


              if(changes.length!=0)
              {
                for(let item in changes)
                {

                  let value= changes[item];
                  this.userChangesSubmissionValues[value] = this.userdata[value]

                }


              }
              this.userChangesSubmissionValues.userId= this.userInformation.userId;
                if(this.toggleControl.value==true)
                {
                  this.userChangesSubmissionValues.reqStatus=true;
                }
                else{
                  this.userChangesSubmissionValues.reqStatus=false;
                }

                //put call

                this.userProfileService.updateUserDetails(this.userChangesSubmissionValues).subscribe(data=>{
                  if (data != null && data.status === 200)
                  {
                    this.popUpModalSuccess.fire({
                      icon: 'success',
                      title: data.message
                    })

                  }
                  else{

                    this.popUpModalError.fire({
                      icon: 'error',
                      title:  data.message
                    })
                  }

                },

                error => {

                  this.popUpModalError.fire({
                    icon: 'error',
                    title:  error.message
                  })
                })


              console.log(this.userChangesSubmissionValues);
           }
          }
     public changetoPremium() {
      console.log(this.toggleControl.value);
    }

}
