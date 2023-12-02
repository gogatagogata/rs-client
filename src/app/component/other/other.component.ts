import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import { GeoTIFF as GTSource, OSM } from 'ol/source';
import { Extent } from 'ol/extent';
import { transformExtent } from 'ol/proj';
import TileLayer from 'ol/layer/WebGLTile.js';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4.js';
import {
  GeoTiffResponse,
  GeoTiffResponseItem,
  GeotifService,
} from 'src/app/services/geotif.service';
import { FormBuilder } from '@angular/forms';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature, View } from 'ol';
import { Geometry } from 'ol/geom';
import Draw, { createBox, DrawEvent } from 'ol/interaction/Draw';

@Component({
  selector: 'other-component',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.css'],
})
export class OtherComponent {
  loading: boolean = false;
  geoTiffLayer: TileLayer = new TileLayer({});
  map: Map = new Map();
  thumbnailsData: GeoTiffResponseItem[] = [];
  currentExtent: Extent | undefined;
  vectorLayer = new VectorLayer({
    source: new VectorSource({ wrapX: false }),
  });

  constructor(private geotifService: GeotifService) {}

  ngOnInit(): void {
    proj4.defs(
      'EPSG:32634',
      '+proj=utm +zone=34 +datum=WGS84 +units=m +no_defs'
    );
    proj4.defs(
      'EPSG:32635',
      '+proj=utm +zone=35 +datum=WGS84 +units=m +no_defs'
    );
    register(proj4);
    this.initGeoTiff3BandsLayer();
    this.initMap();
  }

  initMap() {
    const drawInteraction = this.createBBoxDrawInteraction(
      this.vectorLayer.getSource()!
    );

    this.map = new Map({
      view: new View({
        center: [0, 0],
        zoom: 0,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        this.geoTiffLayer,
        this.vectorLayer,
      ]
    });
    this.map.addInteraction(drawInteraction);
    setTimeout(() => {
      this.map.setTarget('map');
    }, 0);
  }
  private createBBoxDrawInteraction(source: VectorSource) {
    const drawInteraction = new Draw({
      source: source,
      type: 'Circle',
      geometryFunction: createBox(),
    });
    drawInteraction.on('drawend', (e: DrawEvent) => this.onDrawEnd(e));
    return drawInteraction;
  }

  onDrawEnd(e: DrawEvent): void {
    const feature: Feature<Geometry> = e.feature;
    const extent = feature.getGeometry()?.getExtent();
    this.currentExtent = extent;
    const extentEPSG4326: number[] = transformExtent(
      extent!,
      'EPSG:3857',
      'EPSG:4326'
    );
    console.log(`EPSG:4326 Extent: ${extentEPSG4326}`);
    console.log(extentEPSG4326);

    this.loading = true;

    this.geotifService.getGeoTiffAsset(extentEPSG4326).subscribe(
      async (blobResult: GeoTiffResponse) => {
        console.log('!!!');
        console.log(blobResult);
        this.thumbnailsData = blobResult.stacItems;
        // const tiff: GeoTIFF = await fromBlob(
        //   new Blob([stacItem.data], { type: 'blob' })
        // );
        // const image: GeoTIFFImage = await tiff.getImage();

        // const epsgCode =
        //   image.geoKeys.ProjectedCSTypeGeoKey ||
        //   image.geoKeys.GraphicTypeGeoKey;

        // console.log('PROJECTION : ' + epsgCode);

        // console.log(tiff);
        // console.log(image);

        // const source = new GTSource({
        //   sources: [
        //     {
        //       blob: blob,
        //     },
        //   ],
        // });

        // this.geoTiffLayer.setSource(source);
        // // this.geoTiffLayer.setExtent(extent);
        this.loading = false;
      },
      (error) => {
        console.log('Error!');
        console.log(error);
        this.loading = false;
      }
    );
  }
  private initGeoTiff3BandsLayer() {
    this.geoTiffLayer = new TileLayer({
      style: {
        variables: { red: 1, green: 2, blue: 3 },
        color: [
          'array',
          ['band', ['var', 'red']],
          ['band', ['var', 'green']],
          ['band', ['var', 'blue']],
          1,
        ],
      },
    });
  }
  logCoordinates(event: any) {
    console.log(this.map.getEventCoordinate(event));
  }
  onProductClick(downloadUrl: string) {
    console.log(downloadUrl);
    this.loading = true;
    const source = new GTSource({
      sources: [
        {
          url: downloadUrl,
        },
      ],
    });
    console.log(source);
    this.geoTiffLayer.setSource(source);
    this.geoTiffLayer.setExtent(this.currentExtent);
    this.loading = false;
  }
}
