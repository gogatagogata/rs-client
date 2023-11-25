import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OtherComponent } from './component/other/other.component';
import { AppComponent } from './component/app.component';
import { MapComponent } from './component/map/map.component';
import { BandsComponent } from './component/bands/bands.component';
import { TimeComponent } from './component/time/time.component';
import { BandsApiComponent } from './component/bands-api/bands-api.component';
import { BandsOdataComponent } from './component/bands-odata/bands-odata.component';

const routes: Routes = [
  { path: 'map-component', component: MapComponent },
  { path: 'bands', component: BandsComponent },
  { path: 'bands-api', component: BandsApiComponent },
  { path: 'bands-odata', component: BandsOdataComponent },
  { path: 'time', component: TimeComponent },
  { path: 'other', component: OtherComponent },
  { path: '', redirectTo: '/map-component', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
