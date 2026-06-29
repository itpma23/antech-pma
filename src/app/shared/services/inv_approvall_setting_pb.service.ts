import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { SERVER_API_URL } from "src/app/app.constants";
import { InvApprovalSettingPb } from "../models/inv_approval_setting.model";

@Injectable({
    providedIn: 'root'
})
export class InvApprovalSettingPbService {
    private api = SERVER_API_URL;

    constructor(
        private route: Router,
        private httpClient: HttpClient
    ) {

    }

      getAllByType(tipe) {
    return this.httpClient.get<any>(`${this.api}/GbmOrganisasi/getAllByTipe/${tipe}`);
  }

    getById(id: number) {
        return this.httpClient.get(`${this.api}/InvApprovalSettingPb/${id}`)
    }

    create(akun: any) {
        return this.httpClient.post(`${this.api}/InvApprovalSettingPb`, akun,

        );
    }

    update(id: any, PrcApprovallSetting: any) {
        return this.httpClient.put(`${this.api}/InvApprovalSettingPb/${id}`, PrcApprovallSetting);
    }

    delete(id: number) {
        let data = { "id": id.toString() };
        return this.httpClient.delete(`${this.api}/InvApprovalSettingPb/${id}`);
    }

    getPdfSlip(id) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/pdf',
                // 'Authorization' : this.authKey,
                'Accept': 'application/pdf',
                // 'NAMADB': 'testing',
                // 'NAMAPATH': 'Testing'
                //observe : 'response'
            }),
            'responseType': 'blob' as 'json'

        };
        return this.httpClient.get<any>(`${this.api}/PrcApprovallSetting/print_slip/${id}`, httpOptions);
    }

    getKaryawanByLokasiAndKode(lokasi_id: number,kode:string,isActive:number ) {
		return this.httpClient.get(`${this.api}/InvApprovalSettingPb/getKaryawanByLokasiAndKode/${lokasi_id}/${kode}/${isActive}`);
	}

     getByLokasiKodeKaryawan(lokasi_id: number,kode:string,karyawan_id: number) {
		return this.httpClient.get(`${this.api}/InvApprovalSettingPb/getByLokasiKodeKaryawan/${lokasi_id}/${kode}/${karyawan_id}`);
	}

    
}