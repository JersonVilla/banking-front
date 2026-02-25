import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';
import { Cliente } from '../common/cliente';
import { HttpClient } from '@angular/common/http';
import { ClienteBasic } from '../common/cliente-basic';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  
  private apiUrl : string = "http://localhost:8080/clientes";

  private terminoBusquedaSubject = new BehaviorSubject<string>('');
  public terminoBusqueda$ = this.terminoBusquedaSubject.asObservable();

  constructor(private httpClient:HttpClient) {}

  actualizarTerminoBusqueda(termino: string): void {
    this.terminoBusquedaSubject.next(termino);
  }

  getClientes(): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(this.apiUrl);
  }

  createCliente(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.post<Cliente>(this.apiUrl, cliente);
  }

  updateCliente(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.put<Cliente>(`${this.apiUrl}/${cliente.id}`, cliente);
  }

  deleteCliente(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }

  getClientesActivos(): Observable<ClienteBasic[]> {
    return this.httpClient.get<ClienteBasic[]>(`${this.apiUrl}/activos`);
  }

}
