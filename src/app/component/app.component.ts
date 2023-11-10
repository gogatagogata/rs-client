import { Component, OnInit } from '@angular/core';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileArcGISRest from 'ol/source/TileArcGISRest';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  osmSource = new OSM();
  naipSource = new TileArcGISRest({
    url: 'https://naip.imagery1.arcgis.com/arcgis/rest/services/NAIP/ImageServer',
  });
  landsatSource = new TileArcGISRest({
    url: 'https://landsat2.arcgis.com/arcgis/rest/services/Landsat/MS/ImageServer',
  });
  layer = new TileLayer();
  map: Map = new Map();

  disableSelect = new FormControl(false);
  ngOnInit(): void {
    this.map = new Map({
      view: new View({
        center: [0, 0],
        zoom: 0,
      }),
      layers: [
        new TileLayer({
          source: this.osmSource,
          //   extent: [
          //     2811031.5665185726, 5393107.291675044, 2821657.957030993,
          //     5398771.537332108,
          //   ],
        }),
        this.layer,
      ],
      target: 'map',
    });
  }

  selectionChange(selectedLayer: any) {
    if (selectedLayer === 'NAIP') {
      this.layer.setSource(this.naipSource);
    }
    if (selectedLayer === 'LANDSAT') {
      this.layer.setSource(this.landsatSource);
    }
    if (selectedLayer === 'OPENMAPS') {
      this.layer.setSource(this.osmSource);
    }
  }

  logCoordinates(coordinate: any) {
    console.log(coordinate);
  }
}
