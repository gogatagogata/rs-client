import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OtherComponent } from "./component/other/other.component";
import { AppComponent } from "./component/app.component";
import {MapComponent} from "./component/map/map.component";

const routes: Routes = [
  { path: 'app-root', component: AppComponent },
  { path: 'other-component', component: OtherComponent },
  { path: 'map-component', component: MapComponent },
  { path: '', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
