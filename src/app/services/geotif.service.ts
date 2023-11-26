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

  getSentinelGeoTiff(
    extent: number[],
    dateFrom: string,
    dateTo: string,
    cloudCoverage: number
  ) {
    console.log('Getting sentinel tiff from processing api with ');
    console.log(dateFrom);
    console.log(dateTo);
    console.log(cloudCoverage);
    return this.http.post(
      `${this.backendUrl}/sentinel`,
      {
        extent: extent,
        dateFrom: dateFrom,
        dateTo: dateTo,
        cloudCoverage: cloudCoverage,
      },
      { responseType: 'blob' }
    );
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

  getRandomGeoTiffStacBlobByExtent(extent: number[]): Observable<Blob> {
    return this.http.post(
      this.backendUrl + '/blob',
      { extent: extent },
      { responseType: 'blob' }
    );
  }

  getGeoTiffStacApiJSON(extent: number[]): Observable<JSON> {
    return this.http.post<JSON>(this.backendUrl + '/json', { extent: extent });
  }
}
