import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { RegisteredUser } from 'src/app/models/registeredUserComponent';
import { AjaxService } from 'src/app/services/ajaxService.service';

import {DataSource} from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  sub: Subscription;
  userId;
  userData: MatTableDataSource<RegisteredUser[]>;
 receivedData;
  headerColumns: string[] = ['userId','userFirstName', 'userLastName','userType','email','activeStatus','approvedStatus','latestUpdated','reqStatus','Actions'];
  additionalColumn = 'Actions';
  constructor(private adminService:AjaxService) { }

  ngOnInit(): void {
    this.userId=localStorage.getItem('userId');
    this.sub  =  this.adminService.getAllUsers(this.userId).subscribe(response=>{
        if(response!=null )
        {
            this.userData=new MatTableDataSource (response);
            this.receivedData =this.userData.filteredData;
            for (let i=0;i<this.receivedData.length;i++)
            {
              if(this.receivedData[i].reqStatus===false)
                this.receivedData[i].disabled=true;
              else{
                this.receivedData[i].disabled=false;
              }
            }
        }
    });


//filtering process







  }

}



