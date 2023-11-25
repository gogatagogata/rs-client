import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ODataQuickLookProduct {
  Id: string;
  Name: string;
  Assets: Asset[];
}
export interface ODataQuickLook {
  quickLookProductList: ODataQuickLookProduct[];
}
export interface Asset {
  DownloadLink: string;
}
@Injectable({
  providedIn: 'root',
})
export class ODataService {
  private backendUrl: string = 'http://localhost:8080/odata';

  constructor(private http: HttpClient) {}

  getODataQuickLook(coords: number[][]): Observable<ODataQuickLook> {
    return this.http.post<ODataQuickLook>(this.backendUrl, { coords: coords });
  }
  getODataProduct(produtcId: string, productName: string): Observable<Blob> {
    return this.http.post(
      this.backendUrl + '/product',
      { productId: produtcId, productName: productName },
      { responseType: 'blob' }
    );
  }
}
