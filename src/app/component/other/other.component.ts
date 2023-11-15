import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import { GeoTIFF } from 'ol/source';
import { createEmpty, getCenter } from 'ol/extent';
import { extend } from 'ol/array';
import { transformExtent } from 'ol/proj';
import TileLayer from 'ol/layer/WebGLTile.js';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4.js';

@Component({
  selector: 'other-component',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.css'],
})
export class OtherComponent {}
