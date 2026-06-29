import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgxPermissionsModule } from 'ngx-permissions';

import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AppRoutes } from './app.routing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/interceptor/auth.interceptor';
import { AuthenticationService } from './shared/services/authentication.service';
import { LoginComponent } from './auth/login/login.component';
import { GoogleMapsComponent } from './maps/googlemaps/googlemaps.component';
import { ModalModule } from 'ngx-bootstrap';
import { HttpConfigInterceptor } from './shared/interceptor/http-config.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import {MatCheckboxModule}from '@angular/material/checkbox';
// import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
  NgxUiLoaderRouterModule,
  NgxUiLoaderHttpModule
} from 'ngx-ui-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpLoaderFactory } from './shared/shared.module';
import { SERVER_API_URL } from 'src/app/app.constants';
import { ToastrModule } from 'ngx-toastr';
// import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
// import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
// import { LoadingBarModule } from '@ngx-loading-bar/core';
const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  "bgsColor": "#499ed0",
  "bgsOpacity": 0.5,
  "bgsPosition": "center-center",
  "bgsSize": 60,
  "bgsType": "three-strings",
  "blur": 5,
  "fgsColor": "#499ed0",
  "fgsPosition": "center-center",
  "fgsSize": 60,
  "fgsType": "three-strings",
  "gap": 24,
  "logoPosition": "center-center",
  "logoSize": 120,
  "logoUrl": "",
  "masterLoaderId": "master",
  "overlayBorderRadius": "0",
  "overlayColor": "rgba(40, 40, 40, 0.8)",
  "pbColor": "#499ed0",
  "pbDirection": "ltr",
  "pbThickness": 3,
  "hasProgressBar": true,
  "text": "",
  "textColor": "#FFFFFF",
  "textPosition": "center-center"
};

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forRoot(AppRoutes, { useHash: true }),
    SidebarModule,
    NavbarModule,
    FooterModule,
    ToastrModule.forRoot(),
    // LoadingBarHttpClientModule,
    // LoadingBarRouterModule,
    // LoadingBarModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule,
    NgxUiLoaderHttpModule.forRoot({
      exclude: [
        SERVER_API_URL + '/PrcPo/countByUserApprove',
        SERVER_API_URL + '/PrcPp/countByUserApprove',
        SERVER_API_URL + '/PrcPp/countPPReadyPO',
        SERVER_API_URL + '/HrmsPengajuanCuti/countByUserApprove',
        SERVER_API_URL + '/InvPemakaianBarangOnline/countByUserApprove',
        SERVER_API_URL + '/asset/list',
        SERVER_API_URL + '/assetKategori/list',
        SERVER_API_URL + '/assetLokasi/list',
        SERVER_API_URL + '/assetTipe/list',
        SERVER_API_URL + '/hrmsJabatan/list',
        SERVER_API_URL + '/hrmsKomponengaji/list',
        SERVER_API_URL + '/hrmsTipekaryawan/list',
        SERVER_API_URL + '/hrmsKaryawan/list',
        SERVER_API_URL + '/karyawan/list',
        SERVER_API_URL + '/estBkmPanen/hitungPremiMandorKerani',
        SERVER_API_URL + '/estBkmPanen/hitungPremi',
        SERVER_API_URL + '/hrmsKaryawangaji/getGajiPerHari',
        SERVER_API_URL + '/AccKegiatan/',
        SERVER_API_URL + '/estBkmPemeliharaan/hitungPremi',
        SERVER_API_URL + '/estBkmPanen/list',
        SERVER_API_URL + '/estBkmPemeliharaan/list',
        SERVER_API_URL + '/estBkmUmum/list',
        SERVER_API_URL + '/trkKegiatanKendaraan/list',
        SERVER_API_URL + '/WrkKegiatan/list',
        SERVER_API_URL + '/WrkKegiatan_mill/list',
        SERVER_API_URL + '/accKasbank/list',
        SERVER_API_URL + '/accJurnalEntry/list',
        SERVER_API_URL + '/accApInvoice/list',
        SERVER_API_URL + '/PrcPo/list',
        SERVER_API_URL + '/PrcPp/list',
        SERVER_API_URL + '/hrmsAbsensi/list',
        SERVER_API_URL + '/PksTimbangan/list',
        SERVER_API_URL + '/PksTimbanganKirim/list',
        SERVER_API_URL + '/PksHargaTbs/list',
        SERVER_API_URL + '/trkKegiatanKendaraan/hitungPremi',
        SERVER_API_URL + '/WrkKegiatan/hitungPremi',
        SERVER_API_URL + '/WrkKegiatan_mill/hitungPremi',
        SERVER_API_URL + '/dashboard/pks_stok_tangki',
        SERVER_API_URL + '/dashboard/pks_pemerimaan_tbs_harian',
        SERVER_API_URL + '/dashboard/pks_pengiriman_cpo_harian',
        SERVER_API_URL + '/dashboard/hrms_jumlah_karyawan',
        SERVER_API_URL + '/dashboard/estate_panen_afdeling_harian',
        SERVER_API_URL + '/dashboard/estate_curah_hujan_harian',
        SERVER_API_URL + '/dashboard/estate_panen_perbulan',
        SERVER_API_URL + '/dashboard/estate_hk_panen_perbulan',
        SERVER_API_URL + '/dashboard/estate_hk_pemeliharaan_perbulan',
        SERVER_API_URL + '/dashboard/estate_hk_all_afdeling_perbulan',
        SERVER_API_URL + '/dashboard/trk_pemakaian_solar_perbulan',
        SERVER_API_URL + '/dashboard/pks_tbs_olah',
        SERVER_API_URL + '/dashboard/pks_pemerimaan_tbs_harian_by_supp',
        
       



      ],
      showForeground: true
    }),
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatRadioModule,MatCheckboxModule,

    NgxPermissionsModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })

    // AuthLayoutComponent

  ],
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true
  },
    HttpClientModule
    , FormsModule, FormBuilder,
    // { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    GoogleMapsComponent,
    // LoginComponent
  ],
  exports: [

    // BlankLayoutComponent,
    // BreadcrumbComponent,
    // ToggleFullscreenDirective
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
