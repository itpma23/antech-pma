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
import { Materi } from '../models/materi.model';
import { FileSaverService } from 'ngx-filesaver';

@Injectable({
	providedIn: 'root'
})

export class MateriService {

	private apiUrl = SERVER_API_URL;


	constructor(
		public router: Router,
		private http: HttpClient,
    private _FileSaverService: FileSaverService,

	) {


	}

	getAll() {
		return this.http.get<Materi[]>(`${this.apiUrl}/materi`);
	}

	getById(id: number) {
		return this.http.get(`${this.apiUrl}/materi/${id}`);
	}
  getDetail(id: number) {
		return this.http.get(`${this.apiUrl}/materi/detail/${id}`);
	}
  download(id,fileName){
   // const fileName ='file_Download';
    // if (fromRemote) {
      this.http.get(`${this.apiUrl}/materi/download/${id}`, {
        observe: 'response',
        responseType: 'blob'
      }).subscribe(res => {
        this._FileSaverService.save(res.body, fileName);
      });
      return;
    //}
    // const fileType = this._FileSaverService.genType(fileName);
    // const txtBlob = new Blob([this.text], { type: fileType });
    // this._FileSaverService.save(txtBlob, fileName);
  }
	create(materi: any) {
		return this.http.post(`${this.apiUrl}/materi`, materi,
    // { headers: new HttpHeaders({
    //   'Content-Type': 'multipart/form-data',
    //   'NAMADB': 'testing',
    //   'NAMAPATH':'Testing',
    //   'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT, DELETE',
    //   'Access-Control-Allow-Headers' : 'Content-Type, Origin, Authorization'
    // })}
    );
	}

	update(id:any,materi: any) {
		return this.http.post(`${this.apiUrl}/materi/update/${id}`, materi);
	}
  updatePhoto(id:any,file: any) {
		return this.http.post(`${this.apiUrl}/materi/edit_picture/${id}`, file);
	}


	delete(id: number) {
    let data={"id":id.toString()};
		return this.http.delete(`${this.apiUrl}/materi/${id}`);
	}


}
