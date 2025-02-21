import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateFactura } from '../models/create-factura.model';
import { Factura } from '../models/factura.model';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {
  private apiUrl = environment.facturasApiUrl;

  constructor(private http: HttpClient) { }

  getFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(this.apiUrl);
  }

  createFactura(factura: CreateFactura): Observable<Factura> {
    return this.http.post<Factura>(this.apiUrl, factura);
  }

  updateFactura(id: number, factura: CreateFactura): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, factura);
  }

  deleteFactura(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
