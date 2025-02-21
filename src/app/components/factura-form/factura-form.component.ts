import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FacturasService } from '../../services/factura.service';
import { Factura } from '../../models/factura.model';

@Component({
  selector: 'app-factura-form',
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
  providers: [provideNativeDateAdapter()],
  templateUrl: './factura-form.component.html',
  styleUrl: './factura-form.component.css'
})
export class FacturaFormComponent {
  facturaForm: FormGroup;
  action: string | undefined;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FacturaFormComponent>,
    private readonly facturaService: FacturasService,
    @Inject(MAT_DIALOG_DATA) public data: { factura: Factura, isEdit: boolean }
  ) {
    this.facturaForm = this.fb.group({
      cliente: ['', Validators.required],
      fecha: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.action = this.data.isEdit ? 'Editar' : 'Crear';

    if (this.data.isEdit) {
      this.facturaForm.patchValue({
        cliente: this.data.factura.cliente,
        fecha: new Date(this.data.factura.fecha)
      });
    }
  }

  processFactura() {
    if (!this.facturaForm.valid) {
      return;
    }

    const factura = {
      cliente: this.facturaForm.value.cliente,
      fecha: this.facturaForm.value.fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    }

    if (this.data.factura) {
      this.facturaService.updateFactura(this.data.factura.id, factura).subscribe(() => {
        this.dialogRef.close(factura);
      });
    } else {
      this.facturaService.createFactura(factura).subscribe(() => {
        this.dialogRef.close(factura);
      });
    }
  }

  cerrarModal() {
    this.dialogRef.close();
  }
}
