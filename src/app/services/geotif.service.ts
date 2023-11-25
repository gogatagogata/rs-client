import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface GeoTiffResponseItem {
  id: number;
  thumbnail: string;
  downloadUrl: string;
}
export interface GeoTiffResponse {
  stacItems: GeoTiffResponseItem[];
}

@Injectable({
  providedIn: 'root',
})
export class GeotifService {
  private backendUrl: string = 'http://localhost:8080/geotiff';

  constructor(private http: HttpClient) {}

  getGeoTiff(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }

  getGeoTiffAsset(extent: number[]): Observable<GeoTiffResponse> {
    return this.http.post<GeoTiffResponse>(this.backendUrl, {
      extent: extent,
    });
  }

  getRandomGeoTiffByExtent(extent: number[]): Observable<Blob> {
    return this.http.post(
      this.backendUrl,
      { extent: extent },
      { responseType: 'blob' }
    );
  }
}
