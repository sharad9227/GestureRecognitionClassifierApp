import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from './../models/ValidUserComponent';
import { Observable } from 'rxjs';
import { premiumGestureConfig } from '../models/premiumGestureConfig';
import { RegisteredUser } from '../models/registeredUserComponent';
@Injectable({ providedIn: 'root' })
export class AjaxService {

  //private validUser=new User();
  // private premiumConfig =new premiumGestureConfig();
  // private registeredUser = new RegisteredUser();
    constructor(private http: HttpClient) { }
    //admin use
    getAllUsers(userId:number):Observable<any> {
        return this.http.get<RegisteredUser[]>(`http://localhost:8086/testjpa_war_exploded/users/getall/${userId}`);
    }

    signUpUser(validUser): Observable<any> {
        return this.http.post(`http://localhost:8086/testjpa_war_exploded/users/register`, validUser);
    }

    loginUser(validUser): Observable<any> {
      return this.http.post(`http://localhost:8086/testjpa_war_exploded/users/login`, validUser);
    }


    //admin use
    deleteUser(id: number): Observable<any>{
        return this.http.delete(`/users/${id}`);
    }

     //send json string data :put request
    updateGestureConfig(premiumConfig) : Observable<any> {
      return this.http.put('http://localhost:8086/testjpa_war_exploded/users/update/gestureconfig',premiumConfig);
    }

    //get config data
    getGestureConfig(configId:number): Observable<any>
    {
      return this.http.get<User>(`http://localhost:8086/testjpa_war_exploded/users/get/${configId}`);
    }



    getUserDetails(userId:number): Observable<any>
    {
      return this.http.get<User>(`http://localhost:8086/testjpa_war_exploded/users/get/user/${userId}`);
    }

     updateUserDetails(userDetails): Observable<any>
     {
       return this.http.put('http://localhost:8086/testjpa_war_exploded/users/update/updateUserDetails',userDetails);
     }









}
