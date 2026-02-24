import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  
  private nuevoSubject = new Subject<void>();

  nuevo$ = this.nuevoSubject.asObservable();

  dispararNuevo() {
    this.nuevoSubject.next();
  }

}
