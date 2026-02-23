import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../common/cliente';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  
  private apiUrl : string = "http://localhost:8080/clientes";


  constructor(private httpClient:HttpClient) {}

  getClientes():Observable<Cliente[]>{
    return this.httpClient.get<Cliente[]>(this.apiUrl);
  }

}
