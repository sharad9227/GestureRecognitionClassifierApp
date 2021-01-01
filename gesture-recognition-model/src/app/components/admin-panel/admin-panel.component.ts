import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { RegisteredUser } from 'src/app/models/registeredUserComponent';
import { AjaxService } from 'src/app/services/ajaxService.service';

import {DataSource} from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { count } from 'rxjs/operators';
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
  headerColumns: string[] = ['SlNo','userId','userFirstName', 'userLastName','userType','email','activeStatus','approvedStatus','latestUpdated','reqStatus','Actions'];

  constructor(private adminService:AjaxService) { }
  @ViewChild(MatPaginator) adminPaginator: MatPaginator;
  ngOnInit(): void {
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


//filtering process







  }


  ngOnChanges(changes:SimpleChanges)
  {
    this.receivedData.paginator = this.adminPaginator;
  }

}



