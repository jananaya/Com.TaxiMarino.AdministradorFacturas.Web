import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DetalleFactura } from '../../models/detalle-factura.model';
import { DetallesFacturaService } from '../../services/detalles-factura.service';

@Component({
  selector: 'app-detalle-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  templateUrl: './detalle-form.component.html',
  styleUrl: './detalle-form.component.css'
})
export class DetalleFormComponent {
  productoForm: FormGroup;
  action: string | undefined;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DetalleFormComponent>,
    private readonly detallesService: DetallesFacturaService,
    @Inject(MAT_DIALOG_DATA) public data: { detalleFactura: DetalleFactura, isEdit: boolean }
   ) {
    this.productoForm = this.fb.group({
      producto: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, [Validators.required, Validators.min(0.01)]],
    });
  }

  ngOnInit() {
    this.action = this.data.isEdit ? 'Editar' : 'Crear';

    if (this.data.isEdit) {
      this.productoForm.patchValue({
        producto: this.data.detalleFactura.producto,
        cantidad: this.data.detalleFactura.cantidad,
        precioUnitario: this.data.detalleFactura.precioUnitario,
      });
    }
  }

  cerrarModal() {
    this.dialogRef.close();
  }

  processProducto() {
    if (!this.productoForm.valid) {
      return;
    }

    if (this.data.isEdit) {

      const detalle = {
        id: this.data.detalleFactura.id,
        subtotal: this.data.detalleFactura.cantidad * this.productoForm.value.precioUnitario,
        ...this.productoForm.value
      };

      this.detallesService.updateDetalleFactura(this.data.detalleFactura.id, this.productoForm.value).subscribe(() => {
        this.dialogRef.close(detalle);
      });
    } else {
      const detalle = {
        facturaId: this.data.detalleFactura.facturaId,
        ...this.productoForm.value
      };

      this.detallesService.createDetalleFactura(detalle).subscribe((result) => {
        this.dialogRef.close(result);
      });
    }

    this.dialogRef.close(this.productoForm.value);
  }
}

