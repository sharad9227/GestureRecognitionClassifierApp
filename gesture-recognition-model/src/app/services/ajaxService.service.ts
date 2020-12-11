import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from './../models/ValidUserComponent';
import { Observable } from 'rxjs';
import { premiumGestureConfig } from '../models/premiumGestureConfig';

@Injectable({ providedIn: 'root' })
export class AjaxService {

  private validUser=new User();
  private premiumConfig =new premiumGestureConfig();
    constructor(private http: HttpClient) { }
    //admin use
    getAllUsers(): Observable<any> {
        return this.http.get<User[]>(`/users`);
    }

    signUpUser(validUser): Observable<any> {
        return this.http.post(`http://localhost:8084/testjpa_war_exploded/users/register`, validUser);
    }

    loginUser(validUser): Observable<any> {
      return this.http.post(`http://localhost:8084/testjpa_war_exploded/users/login`, validUser);
    }


    //admin use
    deleteUser(id: number): Observable<any>{
        return this.http.delete(`/users/${id}`);
    }

     //send json string data :put request
    updateGestureConfig(premiumConfig) : Observable<any> {
      return this.http.put('http://localhost:8084/testjpa_war_exploded/users/update/gestureconfig',premiumConfig);
    }

    //get config data
    getGestureConfig(configId:number): Observable<any>
    {
      return this.http.get<User>(`http://localhost:8084/testjpa_war_exploded/users/get/${configId}`);
    }







}
