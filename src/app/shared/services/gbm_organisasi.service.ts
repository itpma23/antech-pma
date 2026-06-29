import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user.model';
import { SERVER_API_URL } from 'src/app/app.constants';
import { GbmOrganisasi } from '../models/gbm_organisasi.model';

@Injectable({
  providedIn: 'root'
})



export class GbmOrganisasiService {

  private apiUrl = SERVER_API_URL;


  constructor(
    public router: Router,
    private http: HttpClient,

  ) {


  }

  getAllByType(tipe) {
    return this.http.get<any>(`${this.apiUrl}/GbmOrganisasi/getAllByTipe/${tipe}`);
  }

  getAllChildGudang(gudang_id) {
    return this.http.get<any>(`${this.apiUrl}/GbmOrganisasi/getAllChildGudang/${gudang_id}`);
  }

  getAllGudangCentralAndVirtual() {
    return this.http.get<any>(`${this.apiUrl}/GbmOrganisasi/getAllGudangCentralAndVirtual`);
  }
  getAllGudangCentralAndVirtualByLokasi(lokasi_id) {
    return this.http.get<any>(`${this.apiUrl}/GbmOrganisasi/getAllGudangCentralAndVirtualByLokasi/${lokasi_id}`);
  }
  getGudangCentralAndVirtualByUnit(lokasi_id) {
    return this.http.get<any>(`${this.apiUrl}/GbmOrganisasi/getGudangCentralAndVirtualByUnit/${lokasi_id}`);
  }
  getBlokByAfdeling(afdId) {
    return this.http.get<any>(`${this.apiUrl}/GbmOrganisasi/getBlokByAfdeling/${afdId}`);
  }
  getMesinByStasiun(stId) {
    return this.http.get<any>(`${this.apiUrl}/GbmOrganisasi/getMesinByStasiun/${stId}`);
  }
  getBlokByEstate(estId) {
    return this.http.get<any>(`${this.apiUrl}/GbmOrganisasi/getBlokByEstate/${estId}`);
  }
  getMesinByMill(estId) {
    return this.http.get<any>(`${this.apiUrl}/GbmOrganisasi/getMesinByMill/${estId}`);
  }
  getMesinBlokByMillEstate(estId) {
    return this.http.get<any>(`${this.apiUrl}/GbmOrganisasi/getMesinBlokByMillEstate/${estId}`);
  }
  getAfdStnByMillEstate(estId) {
    return this.http.get<any>(`${this.apiUrl}/GbmOrganisasi/getAfdStnByMillEstate/${estId}`);
  }
  getSubById(estId) {
    return this.http.get<any>(`${this.apiUrl}/GbmOrganisasi/getSubById/${estId}`);
  }
  getAfdelingByEstate(estId) {
    return this.http.get<any>(`${this.apiUrl}/GbmOrganisasi/getAfdelingByEstate/${estId}`);
  }
  getAfdelingByEstateAndUser(estId) {
    return this.http.get<any>(`${this.apiUrl}/GbmOrganisasi/getAfdelingByEstateAndUser/${estId}`);
  }
  getGudangByUnit(unId) {
    return this.http.get<any>(`${this.apiUrl}/GbmOrganisasi/getGudangByUnit/${unId}`);
  }
  getAfdStByUnit(AfdStId) {
    return this.http.get<any>(`${this.apiUrl}/GbmOrganisasi/getAfdStByUnit/${AfdStId}`);
  }
  getAllDivisi() {
    return this.http.get<any>(`${this.apiUrl}/GbmOrganisasi/getAllDivisi`);
  }
  getTraksiByUnit(trk_parent_id) {
    return this.http.get<any>(`${this.apiUrl}/GbmOrganisasi/getTraksiByUnit/${trk_parent_id}`);
  }
  getWorkshopByUnit(trk_parent_id) {
    return this.http.get<any>(`${this.apiUrl}/GbmOrganisasi/getWorkshopByUnit/${trk_parent_id}`);
  }
  getBlokByRayon(rayondId) {
    return this.http.get<any>(`${this.apiUrl}/GbmOrganisasi/getBlokByRayon/${rayondId}`);
  }
  getAll() {
    return this.http.get<GbmOrganisasi[]>(`${this.apiUrl}/GbmOrganisasi/getAll`);
  }
  getAllAdmUnit() {
    return this.http.get<any>(`${this.apiUrl}/GbmOrganisasi/getAllAdmUnit`);
  }
  getAllAdmUnitByAccess() {
    return this.http.get<any>(`${this.apiUrl}/GbmOrganisasi/getAllAdmUnitByAccess`);
  }
  getAllHirarki() {
    return this.http.get<any>(`${this.apiUrl}/GbmOrganisasi`);
  }
  getAllChild() {
    return this.http.get<GbmOrganisasi[]>(`${this.apiUrl}/GbmOrganisasi/getmenuAllChild`);
  }
  getAllParent() {
    return this.http.get<GbmOrganisasi[]>(`${this.apiUrl}/GbmOrganisasi/getmenuAllParent`);
  }



  getById(id: number) {
    return this.http.get(`${this.apiUrl}/GbmOrganisasi/getById/${id}`);
  }

  create(menu: any) {
    return this.http.post(`${this.apiUrl}/GbmOrganisasi/getById`, menu,

    );
  }

  update(id: any, menu: any) {
    return this.http.put(`${this.apiUrl}/GbmOrganisasi/${id}`, menu);
  }


  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/GbmOrganisasi/${id}`);
  }


}
