import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './component/app.component';
import { OtherComponent } from './component/other/other.component';
import { NavbarComponent } from './component/navigation/navbar.component';
import { MapComponent } from './component/map/map.component';
import { BandsComponent } from './component/bands/bands.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimeComponent } from './component/time/time.component';

import { HttpClientModule } from '@angular/common/http';
import { BandsApiComponent } from './component/bands-api/bands-api.component';

@NgModule({
  declarations: [
    AppComponent,
    OtherComponent,
    NavbarComponent,
    MapComponent,
    BandsComponent,
    TimeComponent,
    BandsApiComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
