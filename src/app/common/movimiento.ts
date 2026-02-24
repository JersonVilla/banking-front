export interface Movimiento {
  cliente: string;
  estado: boolean;
  fecha: string;
  movimiento: number;
  numeroCuenta: string;
  saldoDisponible: number;
  saldoInicial: number;
  tipoCuenta: string;
  tipoMovimiento: 'DEPOSITO' | 'RETIRO';
}