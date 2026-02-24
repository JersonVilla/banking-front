import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/sidebar-component/sidebar-component';
import { Cliente } from './common/cliente';
import { ClienteService } from './services/cliente-service';
import { FormsModule } from '@angular/forms';
import { ClienteModalComponent } from './components/cliente-modal/cliente-modal-component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, ClienteModalComponent, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('banking-front');
  modalAbierto = signal<boolean>(false);
  clienteSeleccionado: Cliente | null = null;
  terminoBusqueda: string = '';

  constructor(private clienteService: ClienteService) {}

  // Método para buscar
  buscar(): void {
    this.clienteService.actualizarTerminoBusqueda(this.terminoBusqueda);
  }

  // Método para buscar mientras escribe
  onBusquedaChange(): void {
    this.clienteService.actualizarTerminoBusqueda(this.terminoBusqueda);
  }

  abrirModal(): void {
    this.clienteSeleccionado = null;
    this.modalAbierto.set(true);
  }

  guardarCliente(cliente: Cliente): void {
    if (cliente.id === 0) {
      this.clienteService.createCliente(cliente).subscribe({
        next: (response) => {
          console.log('Cliente creado exitosamente:', response);
          this.modalAbierto.set(false);
        },
        error: (error) => {
          console.error('Error al crear cliente:', error);
        }
      });
    } else {
      this.clienteService.updateCliente(cliente).subscribe({
        next: (response) => {
          console.log('Cliente actualizado exitosamente:', response);
          this.modalAbierto.set(false);
        },
        error: (error) => {
          console.error('Error al actualizar cliente:', error);
        }
      });
    }
  }

  cerrarModal(): void {
    this.modalAbierto.set(false);
    this.clienteSeleccionado = null;
  }
}
