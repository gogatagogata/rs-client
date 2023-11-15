import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OtherComponent } from './component/other/other.component';
import { AppComponent } from './component/app.component';
import { MapComponent } from './component/map/map.component';
import { BandsComponent } from './component/bands/bands.component';
import { TimeComponent } from './component/time/time.component';

const routes: Routes = [
  { path: 'map-component', component: MapComponent },
  { path: 'bands', component: BandsComponent },
  { path: 'time', component: TimeComponent },
  { path: '', redirectTo: '/map-component', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
