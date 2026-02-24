import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cuenta } from '../common/cuenta';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CuentaService {
  private apiUrl = 'http://localhost:8080/cuentas';
  private terminoBusquedaSubject = new BehaviorSubject<string>('');
    public terminoBusqueda$ = this.terminoBusquedaSubject.asObservable();
    
  constructor(private http: HttpClient) {}

  getCuentas(): Observable<Cuenta[]> {
    return this.http.get<Cuenta[]>(this.apiUrl);
  }
  
    actualizarTerminoBusqueda(termino: string): void {
      this.terminoBusquedaSubject.next(termino);
    }
  
    createCuenta(cuenta: Cuenta): Observable<Cuenta> {
      return this.http.post<Cuenta>(this.apiUrl, cuenta);
    }
  
    updateCuenta(cuenta: Cuenta): Observable<Cuenta> {
      return this.http.put<Cuenta>(`${this.apiUrl}/${cuenta.numeroCuenta}`, cuenta);
    }
  
    deleteCuenta(numeroCuenta: string): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${numeroCuenta}`);
    }
}
