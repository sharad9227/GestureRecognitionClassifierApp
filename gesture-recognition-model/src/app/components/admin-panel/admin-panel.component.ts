import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { RegisteredUser } from 'src/app/models/registeredUserComponent';
import { AjaxService } from 'src/app/services/ajaxService.service';
import Swal from 'sweetalert2';
import {DataSource} from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { count } from 'rxjs/operators';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})

export class AdminPanelComponent implements OnInit {
  sub: Subscription;
  userId;
  private userDetails={'userId':0};
  userData: MatTableDataSource<RegisteredUser[]>;
 receivedData;
  headerColumns: string[] = ['SlNo','userId','userFirstName', 'userLastName','userType','email','activeStatus','approvedStatus','latestUpdated','reqStatus','Actions','Deactivate'];

  constructor(private adminService:AjaxService,private sharedService:SharedService) { }
  @ViewChild(MatPaginator) adminPaginator: MatPaginator;
  ngOnInit(): void {
    setTimeout(()=>{
      this.sharedService.openSideNavDrawer(true);
    },100)

    this.userId=localStorage.getItem('userId');
    this.userData=new MatTableDataSource();
    this.sub  =  this.adminService.getAllUsers(this.userId).subscribe(response=>{
      let counter=0;
      if(response!=null )
        {
            this.userData.data=response;
            this.receivedData =this.userData.filteredData;
            for (let i=0;i<this.receivedData.length;i++)
            {
              if(this.receivedData[i].reqStatus===false)
                this.receivedData[i].disabled=true;

              else{
                this.receivedData[i].disabled=false;
              }
              counter=counter+1;
              this.receivedData[i].counter= counter;

            }
            console.log(this.receivedData);
           // this.userData.data=this.receivedData;
            this.userData.paginator = this.adminPaginator;
        }
    });








  }

//method for updating user as Premium user
  public approvePremiumAccess(row)
  {
    console.log(row);
    if(row!=null)
    {
      this.userDetails.userId=row.userId;
      this.adminService.updateUserType(this.userDetails).subscribe(response=>{
        if(response!=null && response.status === 200)
        {

          Swal.fire({
            title:response.message,
            timer:2000
          })
        }
      },

      error => {

        Swal.fire({
          title:error.message
        })
      })

    }

  }
  public deactivateUser(row)
  {
    console.log(row);
    if(row!=null)
    {
      this.userDetails.userId=row.userId;
      this.adminService.updateUserStatus(this.userDetails).subscribe(response=>{
        if(response!=null && response.status === 200)
        {

          Swal.fire({
            title:response.message,
            timer:2000
          })
        }
      },

      error => {

        Swal.fire({
          title:error.message
        })
      })

    }

  }


}



