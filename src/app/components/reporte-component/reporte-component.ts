import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { CuentaService } from '../../services/cuenta-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reporte-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reporte-component.html',
  styleUrl: './reporte-component.css',
})
export class ReporteComponent implements OnInit {
  reportesForm!: FormGroup;
  cuentas: string[] = [];

  constructor(
    private fb: FormBuilder,
    private cuentaService: CuentaService,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarCuentasActivas();
    this.reportesForm = this.fb.group({
      numeroCuenta: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
    });
  }

  cargarCuentasActivas() {
    this.cuentaService.getCuentasActivas().subscribe({
      next: (cuentas) => {
        this.cuentas = cuentas.map((c) => c.numeroCuenta);
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error cargando cuentas activas', err),
    });
  }

  generarReporte(): void {
    if (this.reportesForm.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos', 'warning');
      return;
    }

    const { numeroCuenta, fechaInicio, fechaFin } = this.reportesForm.value;

    const inicioIso = `${fechaInicio}T00:00:00`;
    const finIso = `${fechaFin}T23:59:59`;

    const url = `http://localhost:8080/movimientos/reportes/${numeroCuenta}/rango?inicio=${inicioIso}&fin=${finIso}`;
    
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = `reporte_${numeroCuenta}.pdf`;
        a.click();
        URL.revokeObjectURL(objectUrl);
        Swal.fire('Éxito', 'Reporte generado correctamente', 'success');
      },
      error: (err) => {
        console.error('Error generando reporte', err);
        Swal.fire('Error', 'No se pudo generar el reporte', 'error');
      },
    });
  }
}
