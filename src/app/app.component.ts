import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FacturaListComponent } from "./components/factura-list/factura-list.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, FacturaListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Facturas manager';
}
