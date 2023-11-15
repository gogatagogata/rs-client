import { Component, OnInit } from '@angular/core';
import TileLayer from 'ol/layer/WebGLTile.js';
import View from 'ol/View';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileArcGISRest from 'ol/source/TileArcGISRest';
import { GeoTIFF } from 'ol/source';
import {
  FileSystemGeotifService,
  GeoTiffSourceAndExtent,
} from 'src/app/services/file-system-geotif.service';

@Component({
  selector: 'map-component',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  osmSource = new OSM();
  layer = new TileLayer({});
  map: Map = new Map();
  geoTiffSource!: GeoTiffSourceAndExtent;

  constructor(private fileSystemGeoTifService: FileSystemGeotifService) {}

  ngOnInit(): void {
    this.geoTiffSource =
      this.fileSystemGeoTifService.getGeoTiffFromFileSystem('vienna');
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
        this.layer,
      ],
      target: 'map',
    });
  }

  onChangeLayer(selectedLayer: string) {
    if (selectedLayer === 'NAIP') {
      this.layer.setSource(
        new TileArcGISRest({
          url: 'https://naip.imagery1.arcgis.com/arcgis/rest/services/NAIP/ImageServer',
        })
      );
    }
    if (selectedLayer === 'LANDSAT') {
      this.layer.setSource(
        new TileArcGISRest({
          url: 'https://landsat2.arcgis.com/arcgis/rest/services/Landsat/MS/ImageServer',
        })
      );
    }
    if (selectedLayer === 'ArcGisMapServer') {
      this.layer.setSource(
        new TileArcGISRest({
          url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer',
        })
      );
      console.log(this.layer.getSource());
    }
    if (selectedLayer === 'OPENMAPS') {
      this.layer.setSource(this.osmSource);
    }
    if (selectedLayer === 'GeoTIFF') {
      this.layer.setSource(this.geoTiffSource.source);
    }
  }

  logCoordinates(event: any) {
    console.log(this.map.getEventCoordinate(event));
  }
}
