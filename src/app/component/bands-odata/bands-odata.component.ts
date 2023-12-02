import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/WebGLTile.js';
import {
  ImageStatic,
} from 'ol/source';
import VectorSource from 'ol/source/Vector';
import Draw, {
  DrawEvent,
  createBox,
} from 'ol/interaction/Draw';
import Feature from 'ol/Feature';
import { Geometry } from 'ol/geom';
import { transformExtent } from 'ol/proj';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import {
  Extent,
  getBottomLeft,
  getBottomRight,
  getTopLeft,
  getTopRight,
} from 'ol/extent';
import {
  ODataQuickLook,
  ODataQuickLookProduct,
  ODataService,
} from 'src/app/services/odata.service';
import ImageLayer from 'ol/layer/Image';
import OSM from "ol/source/OSM";

@Component({
  selector: 'app-bands-odata',
  templateUrl: './bands-odata.component.html',
  styleUrls: ['./bands-odata.component.css'],
})
export class BandsOdataComponent implements OnInit {
  loading: boolean = false;
  map: Map = new Map();
  quickLookProducts: ODataQuickLookProduct[] = [];
  jp2layer = new ImageLayer({});
  currentExtent: Extent = [];

  constructor(private oDataService: ODataService) {}

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
    this.initMap();
  }

  initMap() {
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
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        // this.geoTiffLayer,
        this.jp2layer,
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

    this.oDataService.getODataQuickLook(extentCoords).subscribe(
      (res: ODataQuickLook) => {
        console.log(res);
        this.quickLookProducts = res.quickLookProductList;
        console.log(this.quickLookProducts);
        this.loading = false;
      },
      (error) => {
        console.log('Error!');
        console.log(error);
        this.loading = false;
      }
    );
  }

  logCoordinates(event: any) {
    console.log(this.map.getEventCoordinate(event));
  }

  onProductClick(productId: string, productName: string) {
    console.log('ProductId');
    console.log(productId);

    this.loading = true;

    this.oDataService
      .getODataProduct(productId, productName)
      .subscribe(async (res) => {
        var blob = new Blob([res], { type: 'image/jp2' });
        let imageUrl = URL.createObjectURL(blob);

        let source = new ImageStatic({
          url: imageUrl,
          projection: 'EPSG:3857',
          imageExtent: this.currentExtent,
        });

        console.log(source.getImageExtent());
        this.jp2layer.setSource(source);
        console.log(this.jp2layer.getSource());
        this.loading = false;
      });
  }

}
