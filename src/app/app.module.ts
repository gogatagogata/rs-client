import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './component/app.component';
import { OtherComponent } from './component/other/other.component';
import { NavbarComponent } from "./component/navigation/navbar.component";
import {MapComponent} from "./component/map/map.component";

@NgModule({
  declarations: [
    AppComponent,
    OtherComponent,
    NavbarComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
