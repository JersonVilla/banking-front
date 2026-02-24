import { Routes } from '@angular/router';
import { HomeComponent } from './components/home-component/home-component';
import { CuentaComponent } from './components/cuenta-component/cuenta-component';
import { MovimientoComponent } from './components/movimiento-component/movimiento-component';

export const routes: Routes = [
  { path: '', redirectTo: 'clientes', pathMatch: 'full' },
  { path: 'clientes', component: HomeComponent },
  { path: 'cuentas', component: CuentaComponent },
  { path: 'movimientos', component: MovimientoComponent },
];
