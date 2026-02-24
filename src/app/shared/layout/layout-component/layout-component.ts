import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../sidebar-component/sidebar-component';
import { LayoutService } from '../../../services/layout-service';

@Component({
  selector: 'app-layout-component',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './layout-component.html',
  styleUrl: './layout-component.css',
})
export class LayoutComponent {

  constructor(private layoutService: LayoutService) {}

  nuevo() {
    this.layoutService.dispararNuevo();
  }

}
