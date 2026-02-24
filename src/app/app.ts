import { Component, signal } from '@angular/core';
import { LayoutComponent } from './shared/layout/layout-component/layout-component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('banking-front');
  
}
