import { Routes } from '@angular/router';
import { EstInspeksiMapComponent } from './est-inspeksi/est-inspeksi.component';
//
import { FullScreenMapsComponent } from './fullscreenmap/fullscreenmap.component';
import { GoogleMapsComponent } from './googlemaps/googlemaps.component';
import { PanenSbmeComponent } from './panen-sbme/panen-sbme.component';
import { SphSbmeComponent } from './sph-sbme/sph-sbme.component';
import { VectorMapsComponent } from './vectormaps/vectormaps.component';
import { SphSbneComponent } from './sph-sbne/sph-sbne.component';
import { PanenSbneComponent } from './panen-sbne/panen-sbne.component';
import { PemupukanSbneComponent } from './pemupukan-sbne/pemupukan-sbne.component';
import { PemupukanSbmeComponent } from './pemupukan-sbme/pemupukan-sbme.component';

export const MapsRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'fullscreen',
      component: FullScreenMapsComponent
    }]
  },
  // {
  //   path: '',
  //   children: [{
  //     path: 'google',
  //     component: GoogleMapsComponent
  //   }]
  // },
   {
    path: '',
    children: [{
      path: 'vector',
      component: VectorMapsComponent
    }]
  },
   {
    path: '',
    children: [{
      path: 'sph-sbme',
      component: SphSbmeComponent
    }]
  },
  {
    path: '',
    children: [{
      path: 'panen-sbme',
      component: PanenSbmeComponent
    }]
  },
  {
    path: '',
    children: [{
      path: 'sph-sbne',
      component: SphSbneComponent
    }]
  },
  {
    path: '',
    children: [{
      path: 'panen-sbne',
      component: PanenSbneComponent
    }]
  },
   {
    path: '',
    children: [{
      path: 'inspeksi',
      component: EstInspeksiMapComponent
    }]
  },
  {
    path: '',
    children: [{
      path: 'pemupukan-sbne',
      component: PemupukanSbneComponent
    }]
  },
   {
    path: '',
    children: [{
      path: 'pemupukan-sbme',
      component: PemupukanSbmeComponent
    }]
  }
];
