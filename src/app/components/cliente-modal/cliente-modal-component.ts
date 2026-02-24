import { Component, effect, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cliente } from '../../common/cliente';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cliente-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cliente-modal-component.html',
  styleUrl: './cliente-modal-component.css',
})
export class ClienteModalComponent {

  @Input() set isOpen(value: any) {
    this._isOpen.set(typeof value === 'function' ? value() : value);
  }
  
  @Input() set cliente(value: Cliente | null) {
    this._cliente = value;
    if (value && this.clienteForm) {
      this.modoEdicion.set(true);
      this.cargarDatosCliente();
    } else if (!value && this.clienteForm) {
      this.modoEdicion.set(false);
      this.clienteForm.reset({ estado: true });

      const passwordControl = this.clienteForm.get('contrasena');
      passwordControl?.setValidators([Validators.required, Validators.minLength(4)]);
      passwordControl?.updateValueAndValidity();
    }
  }
  get cliente(): Cliente | null {
    return this._cliente;
  }
  
  private _isOpen = signal<boolean>(false);
  private _cliente: Cliente | null = null;
  
  modoEdicion = signal<boolean>(false);
  
  @Output() onGuardar = new EventEmitter<Cliente>();
  @Output() onCancelar = new EventEmitter<void>();

  clienteForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initForm();
    effect(() => {
      const estaAbierto = this._isOpen();
      if (estaAbierto && this._cliente) {
        this.cargarDatosCliente();
      }
    });
  }

  // Método público para acceder al signal
  isOpenSignal() {
    return this._isOpen();
  }

  ngOnInit(): void {
  }

  initForm(): void {
    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      genero: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(120)]],
      identificacion: ['', [Validators.required, Validators.minLength(5)]],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9,10}$/)]],
      estado: [true],
      contrasena: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  cargarDatosCliente(): void {
    if (this.cliente && this.clienteForm) {
      this.modoEdicion.set(true);
      this.clienteForm.patchValue({
        nombre: this.cliente.nombre,
        genero: this.cliente.genero,
        edad: this.cliente.edad,
        identificacion: this.cliente.identificacion,
        direccion: this.cliente.direccion,
        telefono: this.cliente.telefono,
        estado: this.cliente.estado
    });
        
    const passwordControl = this.clienteForm.get('contrasena');
    passwordControl?.clearValidators();
    passwordControl?.setValue('');
    passwordControl?.updateValueAndValidity();
      
    }
  }

  guardar(): void {
    if (this.clienteForm.valid) {
      const formValue = this.clienteForm.value;
      const cliente: Cliente = new Cliente(
        this.cliente ? this.cliente.id : null,
        formValue.nombre,
        formValue.genero,
        formValue.edad,
        formValue.identificacion,
        formValue.direccion,
        formValue.telefono,
        formValue.estado,
        formValue.contrasena
      );
      this.onGuardar.emit(cliente);
      console.log('Cliente guardado:', cliente);
      this.cerrarModal();
    } else {
      Object.keys(this.clienteForm.controls).forEach(key => {
        this.clienteForm.get(key)?.markAsTouched();
      });
    }
  }

  cancelar(): void {
    this.onCancelar.emit();
    this.cerrarModal();
  }

  cerrarModal(): void {
    this._isOpen.set(false);
    this.clienteForm.reset({ estado: true });
    this.modoEdicion.set(false);
  }

  // Help_ers para validaciones en el template
  hasError(field: string, error: string): boolean {
    const control = this.clienteForm.get(field);
    return !!(control?.hasError(error) && control?.touched);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.clienteForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

}
