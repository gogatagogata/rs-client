import { Component, OnInit } from '@angular/core';
import { Feature, View } from 'ol';
import STAC, { Extent } from 'ol-stac';
import TileLayer from 'ol/layer/WebGLTile.js';
import { GeoTIFF, OSM } from 'ol/source';
import Map from 'ol/Map';
import { register } from 'ol/proj/proj4';
import proj4 from 'proj4';
import { GeotifService } from 'src/app/services/geotif.service';
import VectorSource from 'ol/source/Vector';
import Draw, { DrawEvent, createBox } from 'ol/interaction/Draw';
import VectorLayer from 'ol/layer/Vector';
import {
  getTopLeft,
  getTopRight,
  getBottomRight,
  getBottomLeft,
} from 'ol/extent';
import GeoJSON from 'ol/format/GeoJSON';
import { Geometry } from 'ol/geom';
import { transformExtent } from 'ol/proj';

@Component({
  selector: 'app-ol-stac',
  templateUrl: './ol-stac.component.html',
  styleUrls: ['./ol-stac.component.css'],
})
export class OlStacComponent implements OnInit {
  osmSource = new OSM();

  map: Map = new Map();
  loading: boolean = false;

  currentExtent: Extent = [];

  constructor(private geoTiffService: GeotifService) {}

  ngOnInit(): void {
    register(proj4);
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

    this.geoTiffService.getGeoTiffStacApiJSON(extentEPSG4326).subscribe((r) => {
      console.log(r);
      const l = new STAC({
        data: r,
      });
      console.log(l.getData());
      const s: STAC = l.getData();
      console.log(s.getAssets());

      let geoTiffRGBAsset = s
        .getAssets()
        .filter(
          (a) => a.roles.includes('visual') && a.type.includes('image/tiff')
        )[0];
      console.log(geoTiffRGBAsset);
      console.log(geoTiffRGBAsset.href);

      let b08 = s.getAssets().filter((a) => a.href.endsWith('B08.tif'))[0];
      console.log(b08);
      console.log(b08.href);

      let geoTiffRGBSource = new GeoTIFF({
        sources: [
          {
            url: geoTiffRGBAsset.href,
          },
          {
            url: b08.href,
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
