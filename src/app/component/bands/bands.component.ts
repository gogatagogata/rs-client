import { Component } from '@angular/core';
import TileLayer from 'ol/layer/WebGLTile.js';
import { GeoTIFF, OSM } from 'ol/source';
import Map from 'ol/Map';
import { View } from 'ol';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bands',
  templateUrl: './bands.component.html',
  styleUrls: ['./bands.component.css'],
})
export class BandsComponent {
  channelsForm: FormGroup = new FormGroup({});

  extentBG = [
    2769682.8670147965, 5382304.480299234, 2855674.7978852685,
    5462435.335034151,
  ];
  extentRome = [1385585.909539, 5141536.685675, 1396057.845357, 5148568.905287];
  osmSource = new OSM();
  geoTiffSource = new GeoTIFF({
    sources: [
      {
        url: '../../../assets/responseBG.tif',
      },
    ],
  });
  map: Map = new Map();

  geoTifLayer = new TileLayer({
    source: this.geoTiffSource,
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
  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    this.channelsForm = this.fb.group({
      redChannel: '1',
      greenChannel: '2',
      blueChannel: '3',
    });

    this.channelsForm.valueChanges.subscribe((value) => {
      console.log('Form values:', value);
      this.geoTifLayer.updateStyleVariables({
        red: parseInt(value['redChannel']),
        green: parseInt(value['greenChannel']),
        blue: parseInt(value['blueChannel']),
      });
    });

    console.log(this.geoTiffSource);

    this.map = new Map({
      view: new View({
        center: [0, 0],
        zoom: 0,
        projection: 'EPSG:3857',
        extent: this.extentBG,
      }),
      layers: [
        new TileLayer({
          source: this.osmSource,
        }),
        this.geoTifLayer,
      ],
      target: 'map',
    });
  }

  logCoordinates(event: any) {
    console.log(this.map.getEventCoordinate(event));
  }
}
