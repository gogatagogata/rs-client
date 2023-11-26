import { Component } from '@angular/core';
import { View, Feature } from 'ol';
import { Extent } from 'ol-stac';
import {
  getTopLeft,
  getTopRight,
  getBottomRight,
  getBottomLeft,
} from 'ol/extent';
import TileLayer from 'ol/layer/WebGLTile.js';

import GeoJSON from 'ol/format/GeoJSON';
import { Geometry } from 'ol/geom';
import Draw, { createBox, DrawEvent } from 'ol/interaction/Draw';
import VectorLayer from 'ol/layer/Vector';
import { transformExtent } from 'ol/proj';
import { register } from 'ol/proj/proj4';
import { GeoTIFF, OSM } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import proj4 from 'proj4';
import { GeotifService } from 'src/app/services/geotif.service';
import Map from 'ol/Map';

@Component({
  selector: 'app-sentinel-process-api',
  templateUrl: './sentinel-process-api.component.html',
  styleUrls: ['./sentinel-process-api.component.css'],
})
export class SentinelProcessApiComponent {
  osmSource = new OSM();

  map: Map = new Map();
  loading: boolean = false;

  currentExtent: Extent = [];

  constructor(private geoTiffService: GeotifService) {}

  ngOnInit(): void {
    register(proj4);
    // this.stacLayer.on('change:layers', () => {
    //   const view = this.map.getView();
    //   view.fit(this.stacLayer.getExtent()!);
    // });

    const vectorLayer = new VectorLayer({
      source: new VectorSource({ wrapX: false }),
    });
    const drawInteraction = this.createBBoxDrawInteraction(
      vectorLayer.getSource()!
    );

    this.map = new Map({
      view: new View({
        center: [0, 0],
        zoom: 0,
        projection: 'EPSG:3857',
      }),
      layers: [
        new TileLayer({
          source: this.osmSource,
        }),
        vectorLayer,
      ],
      target: 'map',
    });
    this.map.addInteraction(drawInteraction);
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
  logCoordinates(event: any) {
    console.log(this.map.getEventCoordinate(event));
  }

  onDrawEnd(e: DrawEvent): void {
    const feature: Feature<Geometry> = e.feature;

    console.log(feature);
    console.log(feature.getGeometry()?.get('coordinates'));
    console.log(feature.getGeometryName());
    console.log(feature.getGeometry()?.getExtent());

    var writer = new GeoJSON();
    writer.writeGeometry(feature.getGeometry()!);

    var geoJsonStr = writer.writeFeatures([feature]);
    console.log(geoJsonStr);

    const extent: Extent = feature.getGeometry()?.getExtent()!;
    this.currentExtent = extent;
    const extentEPSG4326: number[] = transformExtent(
      extent!,
      'EPSG:3857',
      'EPSG:4326'
    );
    console.log(`EPSG:4326 Extent: ${extentEPSG4326}`);
    console.log(extentEPSG4326);

    const extentCoords = [
      getTopLeft(extentEPSG4326),
      getTopRight(extentEPSG4326),
      getBottomRight(extentEPSG4326),
      getBottomLeft(extentEPSG4326),
    ];

    this.loading = true;

    this.geoTiffService
      .getSentinelGeoTiffByExtent(extentEPSG4326)
      .subscribe((r) => {
        let geoTiffRGBSource = new GeoTIFF({
          sources: [
            {
              blob: r,
            },
          ],
        });
        console.log(geoTiffRGBSource);
        let geoTiffRGBLayer = new TileLayer({
          source: geoTiffRGBSource,
          extent: extent,
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
        this.map.addLayer(geoTiffRGBLayer);
        this.loading = false;
      });
  }
}
