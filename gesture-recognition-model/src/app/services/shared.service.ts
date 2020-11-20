import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';


@Injectable()
export class SharedService {

   menuToggle = new Subject<boolean>();

setMenuToggle(){
  this.menuToggle.next();
}
getMenuToggle(): Observable<any> {
  return this.menuToggle.asObservable();
}
}
