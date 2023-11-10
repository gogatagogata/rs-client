import { Component, OnInit } from '@angular/core';
import Map from "ol/Map";
import { GeoTIFF } from "ol/source";
import { createEmpty, getCenter } from "ol/extent";
import { extend } from "ol/array";
import { transformExtent } from "ol/proj";
import TileLayer from "ol/layer/WebGLTile.js";
import proj4 from "proj4";
import { register } from "ol/proj/proj4.js";

@Component({
  selector: 'other-component',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.css']
})
export class OtherComponent  implements OnInit {

  map: Map = new Map();
  channels = ["red", "green", "blue"];
  sourceNames = ["B04", "B03", "B02", "B08"];
  sources = [
    new GeoTIFF({
      sources: this.sourceNames.map(function (name) {
        return {
          url: `src/data/response.tif`
        };
      }),
    }),
  ];

  layer = new TileLayer({
    sources: this.sources,
    style: {
      variables: this.getVariables(),
      color: [
        "array",
        ["band", ["var", "red"]],
        ["band", ["var", "green"]],
        ["band", ["var", "blue"]],
        ["band", 5],
      ],
    },
  });


  ngOnInit(): void {
    proj4.defs("EPSG:4326", "+proj=utm +zone=31 +datum=WGS84 +units=m +no_defs");
    proj4.defs("EPSG:4326", "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs");
    register(proj4);

    this.map = new Map({
      target: "map",
      layers: [this.layer],
      view: Promise.all(
        this.sources.map(function (source) {
          return source.getView();
        })
      ).then(function (options) {
        const projection = "EPSG:4326";
        const extent = createEmpty();
        options.forEach(function (options) {
          extend(
            extent,
            transformExtent(options.extent!, options.projection, projection)
          );
        });
        return {
          projection: projection,
          center: getCenter(extent),
          zoom: 0,
          extent: extent,
        };
      }),
    });
  }

  private getVariables() {
    const variables: any = {};
    for (const channel of this.channels) {
      const selector = document.getElementById(channel);
      variables[channel] = parseInt((selector as HTMLInputElement).value, 10);
    }
    return variables;
  }

}

