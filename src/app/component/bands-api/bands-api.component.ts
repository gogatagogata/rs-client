import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/WebGLTile.js';
import { GeoTIFF, OSM } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { GeotifService } from 'src/app/services/geotif.service';
import Draw, { DrawEvent, createBox } from 'ol/interaction/Draw';
import Feature from 'ol/Feature';
import { Geometry } from 'ol/geom';
import { transformExtent } from 'ol/proj';
import { from, lastValueFrom } from 'rxjs';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';

@Component({
  selector: 'app-bands-api',
  templateUrl: './bands-api.component.html',
  styleUrls: ['./bands-api.component.css'],
})
export class BandsApiComponent implements OnInit {
  loading: boolean = false;
  geoTiffLayer: TileLayer = new TileLayer({});
  map: Map = new Map();

  constructor(private geotifService: GeotifService, private fb: FormBuilder) {}

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
        this.geoTiffLayer,
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

  onDrawEnd(e: DrawEvent): void {
    const feature: Feature<Geometry> = e.feature;
    const extent = feature.getGeometry()?.getExtent();
    const extentEPSG4326: number[] = transformExtent(
      extent!,
      'EPSG:3857',
      'EPSG:4326'
    );
    console.log(`EPSG:4326 Extent: ${extentEPSG4326}`);
    console.log(extentEPSG4326);

    this.loading = true;

    this.geotifService.getRandomGeoTiffByExtent(extentEPSG4326).subscribe(
      (blobResult: Blob) => {
        const source = new GeoTIFF({
          sources: [
            {
              blob: blobResult,
            },
          ],
        });
        console.log(source);
        console.log(source.getProjection());

        source.getView().then((view) => {
          const newLayerExtent = view.extent;
          console.log(view.projection?.valueOf);
          console.log(`New GeoTIFF Layer extent: ${newLayerExtent}`);
          this.geoTiffLayer.setExtent(
            transformExtent(newLayerExtent!, view!.projection, 'EPSG:3857')
          );
          this.geoTiffLayer.setSource(source);
          this.loading = false;
        });
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
}
