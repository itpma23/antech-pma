// Service utk listening event dari Component lain yg digunakan utk merefresh Jumlah Notif //
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class NotifCountService {

  private messageSource = new BehaviorSubject('default message');
  listenMessage = this.messageSource.asObservable();

  constructor() { }

 sendMessage(message: string) {
    this.messageSource.next(message)
  }

}
