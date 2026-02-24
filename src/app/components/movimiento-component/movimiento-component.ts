import { Component, signal } from '@angular/core';
import { Movimiento } from '../../common/movimiento';
import { MovimientoService } from '../../services/movimiento-service';
import { LayoutService } from '../../services/layout-service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MovimientoModalComponent } from '../movimiento-modal-component/movimiento-modal-component';

@Component({
  selector: 'app-movimiento-component',
  imports: [CommonModule, MovimientoModalComponent],
  templateUrl: './movimiento-component.html',
  styleUrl: './movimiento-component.css',
})
export class MovimientoComponent {

  movimientos = signal<Movimiento[]>([]);
  movimientoSeleccionado: Movimiento | null = null;
  modalAbierto = signal<boolean>(false);
  terminoBusqueda = signal<string>('');
  movimientosFiltrados = signal<Movimiento[]>([]);

  constructor(
    private movimientoService: MovimientoService,
    private layoutService: LayoutService,
  ) {
    this.cargarMovimientos();
    this.layoutService.nuevo$.subscribe(() => {
      this.abrirModalNueva();
    });
  }

  cargarMovimientos() {
    this.movimientoService.getMovimientos().subscribe({
      next: (data) => {
        this.movimientos.set(data);
        this.movimientosFiltrados.set(data);
      },
      error: (err) => console.error(err),
    });
  }

  guardarMovimiento(movimiento: Movimiento): void {
    if (!this.movimientoSeleccionado) {
      this.movimientoService.createMovimiento(movimiento).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Movimiento creado',
            text: 'El movimiento fue registrado correctamente',
            confirmButtonColor: '#3085d6',
          });
          this.modalAbierto.set(false);
          this.cargarMovimientos();
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
      this.movimientoService.updateMovimiento(movimiento).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Movimiento actualizado',
            text: 'Los datos fueron actualizados correctamente',
            confirmButtonColor: '#3085d6',
          });
          this.modalAbierto.set(false);
          this.cargarMovimientos();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar el movimiento',
          });
          console.error('Error al actualizar movimiento:', error);
        },
      });
    }
  }

  actualizarBusqueda(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.terminoBusqueda.set(value);
    this.filtrarCuentas();
  }

  filtrarCuentas(): void {
    const termino = this.terminoBusqueda().toLowerCase();

    if (!termino) {
      this.movimientosFiltrados.set(this.movimientos());
      return;
    }

    const filtradas = this.movimientos().filter(
      (c) =>
        c.numeroCuenta.toLowerCase().includes(termino) ||
        c.tipoCuenta.toLowerCase().includes(termino) ||
        c.estado.toString().toLowerCase().includes(termino) ||
        c.tipoMovimiento.toLowerCase().includes(termino),
    );

    this.movimientosFiltrados.set(filtradas);
  }

  get cuentasDisponibles(): string[] {
    const cuentas = this.movimientos().map(m => m.numeroCuenta);
    return Array.from(new Set(cuentas));
  }

  abrirModalNueva(): void {
    this.movimientoSeleccionado = null;
    this.modalAbierto.set(true);
  }

  cerrarModal(): void {
    this.modalAbierto.set(false);
    this.movimientoSeleccionado = null;
  }

}
