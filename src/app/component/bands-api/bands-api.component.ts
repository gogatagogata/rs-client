import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/WebGLTile.js';
import { GeoTIFF, OSM } from 'ol/source';
import { GeotifService } from 'src/app/services/geotif.service';

@Component({
  selector: 'app-bands-api',
  templateUrl: './bands-api.component.html',
  styleUrls: ['./bands-api.component.css'],
})
export class BandsApiComponent implements OnInit {
  channelsForm: FormGroup = new FormGroup({});

  map: Map = new Map();

  constructor(private geotifService: GeotifService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.channelsForm = this.fb.group({
      redChannel: '1',
      greenChannel: '2',
      blueChannel: '3',
    });

    this.geotifService
      .getGeoTiff('http://localhost:8080/geotiff')
      .subscribe((res) => {
        console.log(res);

        const layer = new TileLayer({
          source: new GeoTIFF({
            sources: [
              {
                blob: res,
              },
            ],
          }),
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

        this.channelsForm = this.fb.group({
          redChannel: '1',
          greenChannel: '2',
          blueChannel: '3',
        });

        this.channelsForm.valueChanges.subscribe((value) => {
          console.log('Form values:', value);
          layer.updateStyleVariables({
            red: parseInt(value['redChannel']),
            green: parseInt(value['greenChannel']),
            blue: parseInt(value['blueChannel']),
          });
        });

        this.initMap(layer);
      });
  }

  initMap(layer: TileLayer) {
    this.map = new Map({
      view: new View({
        center: [0, 0],
        zoom: 0,
        projection: 'EPSG:3857',
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        layer,
      ],
      target: 'map',
    });
  }

  logCoordinates(event: any) {
    console.log(this.map.getEventCoordinate(event));
  }
}
