import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { PrcQuotationService } from 'src/app/shared/services/prc_quotation.service';
import { formatDate } from '@angular/common';

import * as QuillNamespace from 'quill';
let Quill: any = QuillNamespace;
import { VideoHandler, ImageHandler, Options } from 'ngx-quill-upload';
import { HttpClient, HttpHeaders } from '@angular/common/http';

Quill.register('modules/imageHandler', ImageHandler);
Quill.register('modules/videoHandler', VideoHandler);
Quill.register('modules/imageResize', ImageResize);
import ImageResize from 'quill-image-resize-module';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SERVER_API_URL, SERVER_PATH_URL } from 'src/app/app.constants';
Quill.register('modules/imageResize', ImageResize);
declare var swal: any;
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'add-cmp',
  templateUrl: 'add.component.html',
  styleUrls: ['add.component.css'],
})

export class AddComponent implements OnInit, AfterViewInit {
  isFormSubmitted = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();
  public dataSelectMapel: any[] = [];
  public dataSelectKelas: any[] = [];
  public dataSelectSemester: any[] = [];
  public options: any;
  type;
  modules = {
    syntax: false,
    toolbar: [
      [{ 'font': [] }],
      ['blockquote', 'code-block'],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
     // [{ 'header': 1 }, { 'header': 2 }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image', 'video', 'formula'],
      ['clean'],['omega' ]
    ],
    formula: true,
    imageResize: {
      modules: ['Resize', 'DisplaySize', 'Toolbar']
    },
    imageHandler: {
      upload: (file) => {
        return new Promise((resolve, reject) => {

          if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg') { // File types supported for image
            if (file.size < 1000000) { // Customize file size as per requirement

              // Sample API Call
              const uploadData = new FormData();
              uploadData.append('userfile', file, file.name);

              return this.http.post(`${SERVER_API_URL}/uploadFile/rpp`, uploadData, {
                // headers: new HttpHeaders({
                //   'NAMADB': 'testing',
                //   'NAMAPATH': 'Testing'
                // })
              }).toPromise()
                .then(result => {
                  resolve(this.PATH_URL+'/'+this.pathName+'/userfiles/files/'+result['filename']);
                  console.log(result);// RETURN IMAGE URL from response
                })
                .catch(error => {
                  reject('Upload failed');
                  // Handle error control
                  console.error('Error:', error);
                });
            } else {
              reject('Size too large');
              // Handle Image size large logic
            }
          } else {
            reject('Unsupported type');
            // Handle Unsupported type logic
          }
        });
      },
      accepts: ['png', 'jpg', 'jpeg', 'jfif'] // Extensions to allow for images (Optional) | Default - ['jpg', 'jpeg', 'png']
    } as Options,
    videoHandler: {
      upload: (file) => {
        return new Promise((resolve, reject) => {

          // if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg') { // File types supported for image
          //   if (file.size < 1000000) { // Customize file size as per requirement

          // Sample API Call
          const uploadData = new FormData();
          uploadData.append('userfile', file, file.name);
          return this.http.post(`${SERVER_API_URL}/uploadFile/rpp`, uploadData, {
            // headers: new HttpHeaders({
            //   'NAMADB': 'testing',
            //   'NAMAPATH': 'Testing'
            // })
          }).toPromise()
            .then(result => {
              resolve(this.PATH_URL+'/'+this.pathName+'/userfiles/files/'+result['filename']);
              console.log(result);// RETURN IMAGE URL from response
            })
            .catch(error => {
              reject('Upload failed');
              // Handle error control
              console.error('Error:', error);
            });
          // } else {
          //   reject('Size too large');

          // }
          // } else {
          //   reject('Unsupported type');

          // }
        });
      },
      accepts: ['mpeg', 'avi']  // Extensions to allow for videos (Optional) | Default - ['mp4', 'webm']
    } as Options
  };
  pengajar;
  pathName;
  PATH_URL;

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private prcQuotationService: PrcQuotationService,



    private http: HttpClient,
    private authenticationService: AuthenticationService

  ) {
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;

    this.entryForm = this.builder.group({
      no_quotation: new FormControl(null, Validators.required),
      no_referensi: new FormControl(null, Validators.required),
      catatan: new FormControl(''),

      file: new FormControl(null, []),
    });



  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }


  private loadSelect2(): void {


  }

  onSubmit() {
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let frmData = new FormData();

    // let arr_mapel = [];
    // arr_mapel = this.entryForm.get('mapel_id').value;
    // let mapel_id = arr_mapel.map(a => { return a.id });

    frmData.append('no_quotation', this.entryForm.get('no_quotation').value);
    frmData.append('no_referensi', this.entryForm.get('no_referensi').value);
    frmData.append('catatan', this.entryForm.get('catatan').value);

    frmData.append("userfile", this.entryForm.get('file').value);
    this.prcQuotationService.create(frmData).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Simpan berhasil',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        this.event.emit('OK');
        this.bsModalRef.hide();
      }
    });
  }

  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.entryForm.patchValue({
      file: file
    });
    this.entryForm.get('file').updateValueAndValidity()
    console.log(file);
  }
  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {

    this.loadSelect2();


  }
  valueChange($event) {
    console.log($event);

  }
}
