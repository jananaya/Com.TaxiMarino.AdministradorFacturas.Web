import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateDetalleFactura } from '../models/create-detalle-factura.model';
import { DetalleFactura } from '../models/detalle-factura.model';
import { UpdateDetalleFactura } from '../models/update-detalle-factura.model';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class DetallesFacturaService {
  private apiUrl = environment.detallesFacturaApiUrl;

  constructor(private http: HttpClient) { }

  getDetallesFactura(facturaId: number): Observable<DetalleFactura[]> {
    return this.http.get<DetalleFactura[]>(`${this.apiUrl}/facturas/${facturaId}`);
  }

  createDetalleFactura(detalle: CreateDetalleFactura): Observable<DetalleFactura> {
    return this.http.post<DetalleFactura>(this.apiUrl, detalle);
  }

  updateDetalleFactura(id: number, detalle: UpdateDetalleFactura): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, detalle);
  }

  deleteDetalleFactura(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
