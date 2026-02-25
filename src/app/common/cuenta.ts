export interface Cuenta {
  numeroCuenta: string;
  clienteId: number;
  tipoCuenta: string;
  saldoInicial: number;
  estado: boolean;
  nombreCliente?: string;
}