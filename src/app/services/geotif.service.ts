import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeotifService {
  private backendUrl: string = 'http://localhost:8080/geotiff';

  constructor(private http: HttpClient) {}

  getGeoTiff(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }

  getRandomGeoTiffByExtent(extent: number[]): Observable<Blob> {
    return this.http.post(
      this.backendUrl,
      { extent: extent },
      { responseType: 'blob' }
    );
  }
}
