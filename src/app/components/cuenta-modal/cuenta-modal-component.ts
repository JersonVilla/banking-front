import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cuenta } from '../../common/cuenta';

@Component({
  selector: 'app-cuenta-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cuenta-modal-component.html',
  styleUrl: './cuenta-modal-component.css',
})
export class CuentaModalComponent {

  @Input() isOpen = false;

  @Input() set cuenta(value: Cuenta | null) {
    if (value) {
      this.modoEdicion.set(true);
      this.form.patchValue(value);
      this.form.get('numeroCuenta')?.disable();
      this.form.get('nombreCliente')?.disable();
    } else {
      this.modoEdicion.set(false);
      this.form.reset({ estado: true });
      this.form.get('numeroCuenta')?.enable();
      this.form.get('nombreCliente')?.enable();
    }
  }

  @Output() onGuardar = new EventEmitter<Cuenta>();
  @Output() onCancelar = new EventEmitter<void>();

  modoEdicion = signal(false);

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      numeroCuenta: ['', Validators.required],
      nombreCliente: ['', Validators.required],
      tipoCuenta: ['', Validators.required],
      saldoInicial: [0, [Validators.required, Validators.min(0)]],
      estado: [true]
    });
  }

  guardar() {
    if (this.form.valid) {
      const cuenta: Cuenta = {
        ...this.form.getRawValue()
      };

      this.onGuardar.emit(cuenta);
    } else {
      this.form.markAllAsTouched();
    }
  }

  cerrar() {
    this.onCancelar.emit();
  }

}
