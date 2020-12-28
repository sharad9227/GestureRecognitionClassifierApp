import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';


@Injectable()
export class SharedService {

   menuToggle = new Subject<boolean>();
   showSideNavDrawer = new BehaviorSubject<boolean>(false);
   setLocalStorage= new BehaviorSubject<string>(null);


setMenuToggle(){
  this.menuToggle.next();
}
getMenuToggle(): Observable<any> {
  return this.menuToggle.asObservable();
}


openSideNavDrawer(isOpen:boolean){
this.showSideNavDrawer.next(isOpen);
}

closeSideNavDrawer() :Observable<any>{
  return this.showSideNavDrawer.asObservable();
}

setUser(isSet:string){
  this.setLocalStorage.next(isSet);
  }

getUser() :Observable<any>{
    return this.setLocalStorage.asObservable();
  }








}
