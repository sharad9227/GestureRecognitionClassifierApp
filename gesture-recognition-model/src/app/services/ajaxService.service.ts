import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from './../models/ValidUserComponent';
import { Observable } from 'rxjs';
import { premiumGestureConfig } from '../models/premiumGestureConfig';
import { RegisteredUser } from '../models/registeredUserComponent';
@Injectable({ providedIn: 'root' })
export class AjaxService {

  private baseUrl=`http://localhost:8086/testjpa_war_exploded`;
    constructor(private http: HttpClient) { }
    //admin use
    getAllUsers(userId:number):Observable<any> {
        return this.http.get<RegisteredUser[]>(this.baseUrl+`/users/getall/${userId}`);
    }

    signUpUser(validUser): Observable<any> {
        return this.http.post(this.baseUrl+`/users/register`, validUser);
    }

    loginUser(validUser): Observable<any> {
      return this.http.post(this.baseUrl+`/users/login`, validUser);
    }



     //send json string data :put request
    updateGestureConfig(premiumConfig) : Observable<any> {
      return this.http.put(this.baseUrl+'/users/update/gestureconfig',premiumConfig);
    }

    //get config data
    getGestureConfig(configId:number): Observable<any>
    {
      return this.http.get<User>(this.baseUrl+`/users/get/${configId}`);
    }



    getUserDetails(userId:number): Observable<any>
    {
      return this.http.get<User>(this.baseUrl+`/users/get/user/${userId}`);
    }

     updateUserDetails(userDetails): Observable<any>
     {
       return this.http.put(this.baseUrl+'/users/update/updateUserDetails',userDetails);
     }


     updateUserType(userDetails): Observable<any>
     {
       return this.http.put(this.baseUrl+'/users/update/upgradeUser',userDetails);
     }
     updateUserStatus(userDetails): Observable<any>
     {
       return this.http.put(this.baseUrl+'/users/update/deactivateUser',userDetails);
     }








}
