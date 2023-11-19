import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeotifService {
  constructor(private http: HttpClient) {}

  getGeoTiff(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }
}
