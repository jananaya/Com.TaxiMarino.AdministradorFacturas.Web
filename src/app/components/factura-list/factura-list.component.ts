import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FacturaFormComponent } from '../factura-form/factura-form.component';
import { DetalleFormComponent } from '../detalle-form/detalle-form.component';
import { FacturasService } from '../../services/factura.service';
import { Factura } from '../../models/factura.model';
import { DetalleFactura } from '../../models/detalle-factura.model';
import { DetallesFacturaService } from '../../services/detalles-factura.service';
import { CurrencyFormatPipe } from "../../pipes/currency-format.pipe";

@Component({
  selector: 'app-factura-list',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, CurrencyFormatPipe],
  templateUrl: './factura-list.component.html',
  styleUrl: './factura-list.component.css'
})
export class FacturaListComponent {
  facturas: Factura[] = [];
  selectedDetalleFactura: DetalleFactura[] = [];
  readonly columnsToDisplay = ['cliente', 'total', 'fecha'];
  readonly columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  selectedFactura: Factura | null = null;
  
  private readonly commonDialogConfig = {
    width: '500px',
    maxWidth: '90vw',
    height: 'auto',
    maxHeight: '80vh',
  };

  private readonly dialog = inject(MatDialog);

  constructor(
    private readonly facturaService: FacturasService,
    private readonly detallesService: DetallesFacturaService
  ) {}

  ngOnInit() {
    this.getFacturas();
  }

  private getFacturas(): void {
    this.facturaService.getFacturas().subscribe(facturas => this.facturas = facturas);
  }

  openFacturaForm(isEdit: boolean = false): void {
    const dialogRef = this.dialog.open(FacturaFormComponent, {
      ...this.commonDialogConfig,
      data: { factura: this.selectedFactura, isEdit }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getFacturas();
      }
    });
  }

  openDetalleForm(detalleFactura: DetalleFactura, isEdit: boolean = false): void {
    const dialogRef = this.dialog.open(DetalleFormComponent, {
      ...this.commonDialogConfig,
      data: {
        detalleFactura: { ...detalleFactura, facturaId: this.selectedFactura?.id },
        isEdit
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.actualizarDetalles(result, isEdit);
        this.actualizarTotalFactura();
      }
    });
  }

  toggleRow(factura: Factura): void {
    this.selectedFactura = this.selectedFactura === factura ? null : factura;

    if (this.selectedFactura) {
      this.detallesService.getDetallesFactura(factura.id).subscribe(detalles => {
        this.selectedDetalleFactura = detalles;
        this.actualizarTotalFactura();
      });
    }
  }

  deleteFactura(): void {
    if (!this.selectedFactura) return;

    this.facturaService.deleteFactura(this.selectedFactura.id).subscribe(() => {
      this.getFacturas();
      this.selectedFactura = null;
    });
  }

  deleteDetalle(detalle: DetalleFactura): void {
    this.detallesService.deleteDetalleFactura(detalle.id).subscribe(() => {
      this.selectedDetalleFactura = this.selectedDetalleFactura.filter(d => d.id !== detalle.id);
      this.actualizarTotalFactura();
    });
  }

  private actualizarDetalles(result: DetalleFactura, isEdit: boolean): void {
    if (isEdit) {
      const index = this.selectedDetalleFactura.findIndex(d => d.id === result.id);
      if (index !== -1) {
        this.selectedDetalleFactura[index] = { ...this.selectedDetalleFactura[index], ...result };
        this.selectedDetalleFactura = [...this.selectedDetalleFactura];
      }
    } else {
      this.selectedDetalleFactura = [...this.selectedDetalleFactura, result];
    }
  }

  private actualizarTotalFactura(): void {
    const index = this.facturas.findIndex(f => f.id === this.selectedFactura?.id);
    if (index !== -1) {
      this.facturas[index].total = this.selectedDetalleFactura.reduce((acc, d) => acc + d.cantidad * d.precioUnitario, 0);
    }
  }
}
