import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from './../models/ValidUserComponent';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AjaxService {
    constructor(private http: HttpClient, private validUser: User) { }

    getAllUsers(): Observable<any> {
        return this.http.get<User[]>(`/users`);
    }

    signUpUser(validUser): Observable<any> {
        return this.http.post(`http://localhost:8084/testjpa_war_exploded/users/register`, validUser);
    }

    deleteUser(id: number): Observable<any>{
        return this.http.delete(`/users/${id}`);
    }
}
