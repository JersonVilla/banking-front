import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../common/cliente';
import { ClienteService } from '../../services/cliente-service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/sidebar-component/sidebar-component';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent implements OnInit {

  clientes: Cliente[] = [];

  constructor(private clienteService: ClienteService) { }

  ngOnInit(): void {
    this.clienteService.getClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
      },
      error: (error) => {
        console.error('Error clientes:', error);
      }
    });
  }

}
