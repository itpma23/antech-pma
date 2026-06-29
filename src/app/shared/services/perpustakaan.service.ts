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

@Injectable({
	providedIn: 'root'
})

export class PerpustakaanService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	create(perpustakaan: any) {
		return this.http.post(`${this.apiUrl}/perpus`, perpustakaan,);
	}

	createPenulis(penulis: any) {
		return this.http.post(`${this.apiUrl}/perpus/penulisCreate`, penulis,);
	}

	createPenerbit(penerbit: any) {
		return this.http.post(`${this.apiUrl}/perpus/penerbitCreate`, penerbit,);
	}

	createPeminjam(peminjam: any) {
		return this.http.post(`${this.apiUrl}/perpus/peminjamanBukuCreate`, peminjam,);
	}

	createPengembalianBuku(pengembalian: any) {
		return this.http.post(`${this.apiUrl}/perpus/pengembalianBukuCreate`, pengembalian,);
	}

	getById(id: number) {
		return this.http.get(`${this.apiUrl}/perpus/${id}`);
	}

	penulisGetById(id: number) {
		return this.http.get(`${this.apiUrl}/perpus/penulisGetById/${id}`);
	}

	penerbitGetById(id: number) {
		return this.http.get(`${this.apiUrl}/perpus/penerbitGetById/${id}`);
	}

	peminjamGetById(id: number) {
		return this.http.get(`${this.apiUrl}/perpus/peminjamGetById/${id}`);
	}

	pengembalianGetById(id: number) {
		return this.http.get(`${this.apiUrl}/perpus/pengembalianGetById/${id}`);
	}

	getPenerbit() {
		return this.http.get(`${this.apiUrl}/perpus/getPenerbit`);
	}

	getPenulis() {
		return this.http.get(`${this.apiUrl}/perpus/getPenulis`);
	}

	getListBuku() {
		return this.http.get(`${this.apiUrl}/perpus/getListBuku`);
	}

	getListPeminjam() {
		return this.http.get(`${this.apiUrl}/perpus/getListPeminjam`);
	}

	update(id: any, perpus: any) {
		return this.http.put(`${this.apiUrl}/perpus/${id}`, perpus);
	}

	updatePenulis(id: any, nama: any) {
		return this.http.put(`${this.apiUrl}/perpus/penulisEdit/${id}`, nama);
	}

	updatePenerbit(id: any, nama: any) {
		return this.http.put(`${this.apiUrl}/perpus/penerbitEdit/${id}`, nama);
	}

	updatePeminjam(id: any, peminjam: any) {
		return this.http.put(`${this.apiUrl}/perpus/peminjamEdit/${id}`, peminjam);
	}

	updatePengembalian(id: any, pengembalian: any) {
		return this.http.put(`${this.apiUrl}/perpus/pengembalianEdit/${id}`, pengembalian);
	}

	updatePhoto(id: any, file: any) {
		return this.http.post(`${this.apiUrl}/perpus/sampul/${id}`, file);
	}


	delete(id: number) {
		let data = { "id": id.toString() };
		return this.http.delete(`${this.apiUrl}/perpus/${id}`);
	}

	penulisDelete(id: number) {
		let data = { "id": id.toString() };
		return this.http.delete(`${this.apiUrl}/perpus/penulisDelete/${id}`);
	}

	penerbitDelete(id: number) {
		let data = { "id": id.toString() };
		return this.http.delete(`${this.apiUrl}/perpus/penerbitDelete/${id}`);
	}

	peminjamDelete(id: number) {
		let data = { "id": id.toString() };
		return this.http.delete(`${this.apiUrl}/perpus/peminjamDelete/${id}`);
	}

	pengembalianDelete(id: number) {
		let data = { "id": id.toString() };
		return this.http.delete(`${this.apiUrl}/perpus/pengembalianDelete/${id}`);
	}

}
