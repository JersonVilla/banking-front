import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Movimiento } from '../common/movimiento';

@Injectable({
  providedIn: 'root',
})
export class MovimientoService {
 
  private apiUrl : string = "http://localhost:8080/movimientos";
  
  private terminoBusquedaSubject = new BehaviorSubject<string>('');
    public terminoBusqueda$ = this.terminoBusquedaSubject.asObservable();
  
    constructor(private httpClient:HttpClient) {}
  
    actualizarTerminoBusqueda(termino: string): void {
      this.terminoBusquedaSubject.next(termino);
    }
  
    getMovimientos(): Observable<Movimiento[]> {
      return this.httpClient.get<Movimiento[]>(this.apiUrl);
    }
  
    createMovimiento(movimiento: Movimiento): Observable<Movimiento> {
      return this.httpClient.post<Movimiento>(this.apiUrl, movimiento);
    }
  
    updateMovimiento(movimiento: Movimiento): Observable<Movimiento> {
      return this.httpClient.put<Movimiento>(`${this.apiUrl}/${movimiento.numeroCuenta}`, movimiento);
    }
  
    deleteMovimiento(numeroCuenta: string): Observable<void> {
      return this.httpClient.delete<void>(`${this.apiUrl}/${numeroCuenta}`);
    }

}
