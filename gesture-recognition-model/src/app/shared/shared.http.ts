import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class sharedHttpService{
constructor(private http: HttpClient) {
}

public validUserCheck(id): Observable<any> {

  const collectionUrl = '';
    return this.http.post(collectionUrl);
}
}
