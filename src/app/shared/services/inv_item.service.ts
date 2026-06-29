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
import { Akun } from '../models/akun.model';
import { InvItem } from '../models/inv_item.model';

@Injectable({
	providedIn: 'root'
})

export class InvItemService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<InvItem[]>(`${this.apiUrl}/invItem/getAll`);
	}

	getAllProduk() {
		return this.http.get<InvItem[]>(`${this.apiUrl}/invItem/getAllProduk`);
	}
	getAllSukuCadang() {
		return this.http.get<InvItem[]>(`${this.apiUrl}/invItem/getAllSukuCadang`);
	}
	getAllBahanBkm() {
		return this.http.get<InvItem[]>(`${this.apiUrl}/invItem/getAllBahanBkm`);
	}
	getById(id: number) {
		return this.http.get(`${this.apiUrl}/invItem/${id}`);
	}

	create(akun: any) {
		return this.http.post(`${this.apiUrl}/invItem`, akun,

		);
	}

	update(id: any, invItem: any) {
		return this.http.put(`${this.apiUrl}/invItem/${id}`, invItem);
	}
	updatePhoto(id: any, file: any) {
		return this.http.post(`${this.apiUrl}/invItem/edit_picture/${id}`, file);
	}


	delete(id: number) {
		let data = { "id": id.toString() };
		return this.http.delete(`${this.apiUrl}/invItem/${id}`);
	}

	importExcel(data: FormData) {
		return this.http.post(SERVER_API_URL + '/invItem/import', data);
	}

	saveImport(data: any[]) {
		return this.http.post(SERVER_API_URL + '/invItem/import_save', data);
	}


}
