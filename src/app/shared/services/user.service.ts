import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { SERVER_API_URL } from 'src/app/app.constants';
import { User } from '../models/user.model';

@Injectable({
	providedIn: 'root'
})

export class UserService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,

	) {


	}

	getAll() {
		return this.http.get<any[]>(`${this.apiUrl}/user/getAll`);
	}

	getUserProfileLogin() {
		return this.http.get<any[]>(`${this.apiUrl}/user/getUserProfileLogin`);
	}

	getById(id: number) {
		return this.http.get(`${this.apiUrl}/user/${id}`);
	}

  updateStatus(status:any,user: any) {
    let data={status_id:status,user_id:user}
		return this.http.post(`${this.apiUrl}/user/update_status`, data,

    );
	}
	create(user: any) {
		return this.http.post(`${this.apiUrl}/user`, user,
    );
	}

	update(id:any,user: any) {
		return this.http.put(`${this.apiUrl}/user/${id}`, user);
	}
	updatePassword(id:any,user: any) {
		return this.http.put(`${this.apiUrl}/user/update_password/${id}`, user);
	}

	update_password_login(user: any) {
		return this.http.put(`${this.apiUrl}/user/update_password_login`, user);
	}

  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/user/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/user/${id}`);
	}

	import(file: any) {
		return this.http.post(`${this.apiUrl}/user/import`, file,

    );
	}
}
