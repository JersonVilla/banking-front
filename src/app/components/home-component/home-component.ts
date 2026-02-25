import { Component, OnInit, signal } from '@angular/core';
import { Cliente } from '../../common/cliente';
import { ClienteService } from '../../services/cliente-service';
import { CommonModule } from '@angular/common';
import { ClienteModalComponent } from '../cliente-modal/cliente-modal-component';
import Swal from 'sweetalert2';
import { LayoutService } from '../../services/layout-service';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [CommonModule, ClienteModalComponent],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent implements OnInit {
  clientes = signal<Cliente[]>([]);
  clientesFiltrados = signal<Cliente[]>([]);
  modalAbierto = signal<boolean>(false);
  clienteSeleccionado: Cliente | null = null;
  terminoBusqueda = signal<string>('');

  constructor(private clienteService: ClienteService, private layoutService: LayoutService) {
    this.clienteService.terminoBusqueda$.subscribe((termino) => {
      this.terminoBusqueda.set(termino);
      this.filtrarClientes();
    });
    this.layoutService.nuevo$.subscribe(() => {
      this.abrirModalNuevo();
    });
  }

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (response) => {
        this.clientes.set(response);
        this.filtrarClientes();
      },
      error: (error) => {
        console.error('Error clientes:', error);
      },
    });
  }

  filtrarClientes(): void {
    const termino = this.terminoBusqueda().toLowerCase().trim();

    if (!termino) {
      this.clientesFiltrados.set(this.clientes());
      return;
    }

    const filtrados = this.clientes().filter((cliente) => {
      return (
        cliente.id!.toString().includes(termino) ||
        cliente.nombre.toLowerCase().includes(termino) ||
        cliente.genero.toLowerCase().includes(termino) ||
        cliente.edad.toString().includes(termino) ||
        cliente.identificacion.toLowerCase().includes(termino) ||
        cliente.direccion.toLowerCase().includes(termino) ||
        cliente.telefono.includes(termino) ||
        (cliente.estado ? 'activo' : 'inactivo').includes(termino)
      );
    });

    this.clientesFiltrados.set(filtrados);
  }

  abrirModalEditar(cliente: Cliente): void {
    this.clienteSeleccionado = cliente;
    this.modalAbierto.set(true);
  }

  guardarCliente(cliente: Cliente): void {
    if (!cliente.id) {
      this.clienteService.createCliente(cliente).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Cliente creado',
            text: 'El cliente fue registrado correctamente',
            confirmButtonColor: '#3085d6',
          });
          this.modalAbierto.set(false);
          this.cargarClientes();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo crear el cliente',
          });
          console.error('Error al crear cliente:', error);
        },
      });
    } else {
      this.clienteService.updateCliente(cliente).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Cliente actualizado',
            text: 'Los datos fueron actualizados correctamente',
            confirmButtonColor: '#3085d6',
          });
          this.modalAbierto.set(false);
          this.cargarClientes();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar el cliente',
          });
          console.error('Error al actualizar cliente:', error);
        },
      });
    }
  }

  eliminarCliente(id: number): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.deleteCliente(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El cliente fue eliminado correctamente',
              timer: 2000,
              showConfirmButton: false,
            });

            this.cargarClientes();
          },
          error: (error) => {
            const mensaje = error?.error?.message || 'No se pudo eliminar el cliente';
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: mensaje,
            });

            console.error(error);
          },
        });
      }
    });
  }

  actualizarBusqueda(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.terminoBusqueda.set(value);
    this.filtrarClientes();
  }

  cerrarModal(): void {
    this.modalAbierto.set(false);
    this.clienteSeleccionado = null;
  }
  abrirModalNuevo(): void {
    this.clienteSeleccionado = null;
    this.modalAbierto.set(true);
  }
}
