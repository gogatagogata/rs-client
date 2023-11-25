import { Injectable } from '@angular/core';
import { GeoTIFF } from 'ol/source';

export interface GeoTiffSourceAndExtent {
  source: GeoTIFF;
  extent: number[];
}

@Injectable({
  providedIn: 'root',
})
export class FileSystemGeotifService {
  extentMap: Map<String, number[]> = new Map([
    [
      'vienna',
      [1807582.848366, 6119089.838734, 1844654.799149, 6156161.744708],
    ],
  ]);

  constructor() {}

  getGeoTiffFromFileSystem(fileName: string): GeoTiffSourceAndExtent {
    return {
      source: new GeoTIFF({
        sources: [
          {
            url: `../../../assets/data/${fileName}.tif`,
          },
        ],
      }),
      extent: this.extentMap.get(fileName)!,
    };
  }
  getJp2FromFileSystem(fileName: string): GeoTiffSourceAndExtent {
    return {
      source: new GeoTIFF({
        sources: [
          {
            url: `../../../assets/data/${fileName}.jp2`,
          },
        ],
      }),
      extent: this.extentMap.get(fileName)!,
    };
  }
}
