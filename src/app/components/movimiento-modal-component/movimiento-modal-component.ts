import { Component, effect, EventEmitter, Input, Output, Signal, signal } from '@angular/core';
import { Movimiento } from '../../common/movimiento';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MovimientoService } from '../../services/movimiento-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movimiento-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './movimiento-modal-component.html',
  styleUrl: './movimiento-modal-component.css',
})
export class MovimientoModalComponent {

  @Input() isOpen = false;
  @Input() movimiento: Movimiento | null = null;
  @Input() cuentasDisponibles: string[] = [];

  @Output() onGuardar = new EventEmitter<Movimiento>();
  @Output() onCancelar = new EventEmitter<void>();

  movimientoForm!: FormGroup;
  tipoMovimientos = ['DEPOSITO', 'RETIRO'];
  modoEdicion = false;

  constructor(
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.movimientoForm = this.fb.group({
      numeroCuenta: ['', Validators.required],
      tipoMovimiento: ['DEPOSITO', Validators.required],
      valor: [0, [Validators.required, Validators.min(1)]],
    });

    if (this.movimiento) {
      this.modoEdicion = true;
      this.movimientoForm.patchValue({
        numeroCuenta: this.movimiento.numeroCuenta,
        tipoMovimiento: this.movimiento.tipoMovimiento,
        valor: this.movimiento.movimiento
      });
    } else {
      this.modoEdicion = false;
    }
  }

  cerrar() {
    this.onCancelar.emit();
  }

  guardar() {
      if (this.movimientoForm.valid) {
        const movimiento: Movimiento = {
          ...this.movimientoForm.getRawValue()
        };
  
        this.onGuardar.emit(movimiento);
      } else {
        this.movimientoForm.markAllAsTouched();
      }
    }
}
