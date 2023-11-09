import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OtherComponent } from "./component/other/other.component";
import { AppComponent } from "./component/app.component";

const routes: Routes = [
  { path: 'app-root', component: AppComponent },
  { path: 'other-component', component: OtherComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
