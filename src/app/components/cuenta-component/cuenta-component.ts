import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { CuentaService } from '../../services/cuenta-service';
import { Cuenta } from '../../common/cuenta';
import Swal from 'sweetalert2';
import { CuentaModalComponent } from '../cuenta-modal/cuenta-modal-component';
import { LayoutService } from '../../services/layout-service';

@Component({
  selector: 'app-cuenta-component',
  imports: [CommonModule, CuentaModalComponent],
  templateUrl: './cuenta-component.html',
  styleUrl: './cuenta-component.css',
})
export class CuentaComponent {
  cuentas = signal<Cuenta[]>([]);
  cuentaSeleccionado: Cuenta | null = null;
  modalAbierto = signal<boolean>(false);
  terminoBusqueda = signal<string>('');
  cuentasFiltradas = signal<Cuenta[]>([]);

  constructor(
    private cuentaService: CuentaService,
    private layoutService: LayoutService,
  ) {
    this.cargarCuentas();
    this.layoutService.nuevo$.subscribe(() => {
      this.abrirModalNueva();
    });
  }

  cargarCuentas() {
    this.cuentaService.getCuentas().subscribe({
      next: (data) => {
        this.cuentas.set(data);
        this.cuentasFiltradas.set(data);
      },
      error: (err) => console.error(err),
    });
  }

  abrirModalEditar(cuenta: Cuenta): void {
    this.cuentaSeleccionado = cuenta;
    this.modalAbierto.set(true);
  }

  guardarCuenta(cuenta: Cuenta): void {
    if (!this.cuentaSeleccionado) {
      this.cuentaService.createCuenta(cuenta).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Cuenta creada',
            text: 'La cuenta fue registrada correctamente',
            confirmButtonColor: '#3085d6',
          });
          this.modalAbierto.set(false);
          this.cargarCuentas();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo crear la cuenta',
          });
          console.error('Error al crear cuenta:', error);
        },
      });
    } else {
      this.cuentaService.updateCuenta(cuenta).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Cuenta actualizada',
            text: 'Los datos fueron actualizados correctamente',
            confirmButtonColor: '#3085d6',
          });
          this.modalAbierto.set(false);
          this.cargarCuentas();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar la cuenta',
          });
          console.error('Error al actualizar cuenta:', error);
        },
      });
    }
  }

  eliminarCuenta(numeroCuenta: string): void {
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
        this.cuentaService.deleteCuenta(numeroCuenta).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El cliente fue eliminado correctamente',
              timer: 2000,
              showConfirmButton: false,
            });

            this.cargarCuentas();
          },
          error: (error) => {
            const mensaje = error?.error?.message || 'No se pudo eliminar la cuenta';
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
    this.filtrarCuentas();
  }

  filtrarCuentas(): void {
    const termino = this.terminoBusqueda().toLowerCase();

    if (!termino) {
      this.cuentasFiltradas.set(this.cuentas());
      return;
    }

    const filtradas = this.cuentas().filter(
      (c) =>
        c.numeroCuenta.toLowerCase().includes(termino) ||
        c.nombreCliente!.toLowerCase().includes(termino) ||
        c.tipoCuenta.toLowerCase().includes(termino) ||
        c.estado.toString().toLowerCase().includes(termino),
    );

    this.cuentasFiltradas.set(filtradas);
  }

  abrirModalNueva(): void {
    this.cuentaSeleccionado = null;
    this.modalAbierto.set(true);
  }

  cerrarModal(): void {
    this.modalAbierto.set(false);
    this.cuentaSeleccionado = null;
  }
}
