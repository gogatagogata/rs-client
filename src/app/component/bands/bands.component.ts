import { Component } from '@angular/core';
import TileLayer from 'ol/layer/WebGLTile.js';
import { OSM } from 'ol/source';
import Map from 'ol/Map';
import { View } from 'ol';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  FileSystemGeotifService,
  GeoTiffSourceAndExtent,
} from 'src/app/services/file-system-geotif.service';

@Component({
  selector: 'app-bands',
  templateUrl: './bands.component.html',
  styleUrls: ['./bands.component.css'],
})
export class BandsComponent {
  channelsForm: FormGroup = new FormGroup({});
  map: Map = new Map();

  constructor(
    private fb: FormBuilder,
    private fileSystemGeoTifService: FileSystemGeotifService
  ) {}

  ngOnInit(): void {
    const geoTiffSourceAndExtent =
      this.fileSystemGeoTifService.getGeoTiffFromFileSystem('vienna');

    const geoTiffLayer = this.createLayer(geoTiffSourceAndExtent);

    this.channelsForm = this.fb.group({
      redChannel: '1',
      greenChannel: '2',
      blueChannel: '3',
    });

    this.channelsForm.valueChanges.subscribe((value) => {
      console.log('Form values:', value);
      geoTiffLayer.updateStyleVariables({
        red: parseInt(value['redChannel']),
        green: parseInt(value['greenChannel']),
        blue: parseInt(value['blueChannel']),
      });
    });

    console.log(geoTiffSourceAndExtent);
    console.log(geoTiffLayer);

    this.initMap(geoTiffLayer, geoTiffSourceAndExtent.extent);
  }

  initMap(layer: TileLayer, extent: number[]) {
    this.map = new Map({
      view: new View({
        center: [0, 0],
        zoom: 0,
        projection: 'EPSG:3857',
        extent: extent,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        layer,
      ]
    });
    setTimeout(() => {
      this.map.setTarget('map');
    }, 0);
  }

  private createLayer(geoTiffSourceAndExtent: GeoTiffSourceAndExtent) {
    return new TileLayer({
      source: geoTiffSourceAndExtent.source,
      extent: geoTiffSourceAndExtent.extent,
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
