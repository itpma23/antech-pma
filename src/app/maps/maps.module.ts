import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ModalModule,
  TooltipModule,
  DatepickerModule,
  BsDatepickerModule,
  TabsModule,
  BsDropdownModule,

} from 'ngx-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { ExportAsModule } from 'ngx-export-as';
// import {
//   AgmCoreModule
// } from '@agm/core';

import { MapsRoutes } from './maps.routing';

import { FullScreenMapsComponent } from './fullscreenmap/fullscreenmap.component';
// import { GoogleMapsComponent } from './googlemaps/googlemaps.component';
import { VectorMapsComponent } from './vectormaps/vectormaps.component';
import { SphSbmeComponent } from './sph-sbme/sph-sbme.component';
import { PanenSbmeComponent } from './panen-sbme/panen-sbme.component';
import { EstInspeksiMapComponent } from './est-inspeksi/est-inspeksi.component';
import { ViewInspeksiComponent } from './est-inspeksi/view/view-inspeksi.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LSelect2Module } from 'ngx-select2';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { PanenSbneComponent } from './panen-sbne/panen-sbne.component';
import { SphSbneComponent } from './sph-sbne/sph-sbne.component';
import { PemupukanSbmeComponent } from './pemupukan-sbme/pemupukan-sbme.component';
import { PemupukanSbneComponent } from './pemupukan-sbne/pemupukan-sbne.component';
import { ViewPanenComponent } from './est-panen/view/view-panen.component';
import { EstPanenMapComponent } from './est-panen/est-panen.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MapsRoutes),
    FormsModule, LeafletModule,
    FormsModule, ReactiveFormsModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DatepickerModule,
    TimepickerModule.forRoot(),
    ExportAsModule,
    DataTablesModule,
    LSelect2Module,
    MatInputModule, MatRadioModule,
    // AgmCoreModule.forRoot({
    //   apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    // })
  ],
  declarations: [
    FullScreenMapsComponent,
    // GoogleMapsComponent,
    VectorMapsComponent,
    SphSbmeComponent, PanenSbmeComponent, EstInspeksiMapComponent,
     ViewInspeksiComponent,PanenSbneComponent,SphSbneComponent,
     PemupukanSbmeComponent, PemupukanSbneComponent, ViewPanenComponent,EstPanenMapComponent
  ], entryComponents: [
    ViewInspeksiComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class MapsModule { }
