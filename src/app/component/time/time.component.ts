import { Component } from '@angular/core';
import TileLayer from 'ol/layer/WebGLTile.js';
import { GeoTIFF, OSM, TileWMS } from 'ol/source';
import Map from 'ol/Map';
import { View } from 'ol';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css'],
})
export class TimeComponent {}
