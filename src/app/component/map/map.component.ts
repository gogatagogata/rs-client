import { Component, OnInit } from '@angular/core';
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import Map from "ol/Map";
import OSM from "ol/source/OSM";
import TileArcGISRest from "ol/source/TileArcGISRest";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'map-component',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {

  osmSource = new OSM();
  layer = new TileLayer();
  map: Map = new Map();

  disableSelect = new FormControl(false);
  ngOnInit(): void {

    this.map = new Map({
      view: new View({
        center: [0, 0],
        zoom: 0
      }),
      layers: [
        new TileLayer({
          source: this.osmSource
        }),
        this.layer,
      ],
      target: "map",
    });
  }

  onChangeLayer(selectedLayer: any) {
    if (selectedLayer === "NAIP") {
      this.layer.setSource(
        new TileArcGISRest({ url: "https://naip.imagery1.arcgis.com/arcgis/rest/services/NAIP/ImageServer" })
      );
    }
    if (selectedLayer === "LANDSAT") {
      this.layer.setSource(
        new TileArcGISRest({ url: "https://landsat2.arcgis.com/arcgis/rest/services/Landsat/MS/ImageServer" })
      );
    }
    if (selectedLayer === "OPENMAPS") {
      this.layer.setSource(this.osmSource);
    }
  }

  logCoordinates(event: any) {
    console.log(this.map.getEventCoordinate(event));
  }

}
