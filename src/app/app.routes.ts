import { Routes } from '@angular/router';
import { HomeComponent } from './components/home-component/home-component';
import { CuentaComponent } from './components/cuenta-component/cuenta-component';

export const routes: Routes = [
  { path: '', redirectTo: 'clientes', pathMatch: 'full' },
  { path: 'clientes', component: HomeComponent },
  { path: 'cuentas', component: CuentaComponent },
];
