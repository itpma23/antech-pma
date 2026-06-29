import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";

import { HrmsPengajuanCuti } from 'src/app/shared/models/hrms_pengajuan_cuti.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { HrmsPengajuanCutiService } from 'src/app/shared/services/hrms_pengajuan_cuti.service';
import { formatDate } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
declare var swal: any;

@Component({
  moduleId: module.id,
  selector: 'pp-approval_last-cmp',
  styleUrls: ['approval_last.component.css'],
  templateUrl: 'approval_last.component.html'
})

export class ApprovalLastComponent implements OnInit,AfterViewInit{
  isFormSubmitted=false;
  isChangePhoto=false;
	datepickerConfig = {
		dateInputFormat: 'DD-MM-YYYY',
		containerClass: 'theme-red'
	}
  entryForm: FormGroup;
  categories: any[] = [];
  event: EventEmitter<any>=new EventEmitter();
  HrmsPengajuanCuti:HrmsPengajuanCuti;
  dbName;
  pathName;
  PATH_URL;

  dataSelectTanki;
  dataSelectSimbol;
  dataSelectLokasi;
  dataSelectKode;
  dataSelectKaryawan;
  dataSelectItem;

  dataItem;
  status_id='1';
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private HrmsPengajuanCutiService: HrmsPengajuanCutiService,
    private authenticationService: AuthenticationService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private KaryawanService: KaryawanService,
    private InvItemService: InvItemService,
    ) {
      this.dbName= this.authenticationService.getUserDB();
      this.pathName= this.authenticationService.getUserPath();
      this.PATH_URL=SERVER_PATH_URL;

      let toDate: Date = new Date();

      this.entryForm = this.builder.group({
        // karyawan_id: new FormControl([], Validators.required),
        lokasi_id: new FormControl([]),
        tanggal: new FormControl(toDate),
        catatan: new FormControl(''),
        note_approve: new FormControl('', Validators.required),
        status: new FormControl('', Validators.required),
        status_id: new FormControl("1", Validators.required),
        details: this.builder.array([]),

      });




  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {

    this.entryForm.controls['status'].patchValue(this.HrmsPengajuanCuti.last_approve_position);

    this.HrmsPengajuanCutiService.getPdfSlip(this.HrmsPengajuanCuti.id).subscribe(
      (res) => {
        var fileURL = URL.createObjectURL(res);
        document.querySelector("iframe").src = fileURL;
      }
    );
  }
  public options: any;


  private loadSelect2(): void {


    // let selectedLokasi;
    // this.GbmOrganisasiService.getAllByType("UNIT").subscribe(x=>{
    //   this.dataSelectLokasi=[];
    //   x.forEach(d => {
    //     this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
    //     if (this.HrmsPengajuanCuti.lokasi_id == d.id) {
    //       selectedLokasi = { "id": d.id, "text": d.nama }
    //     }
    //   });
    //   this.entryForm.get('lokasi_id').patchValue(selectedLokasi);
    // });

    // let selectedItem;
    // this.InvItemService.getAll().subscribe(x=>{
    //   this.dataSelectItem=[];
    //   this.dataItem = x['data'];
    //   x['data'].forEach(d => {
    //     this.dataSelectItem.push({"id":d.id,"text":d.kode+" - "+d.nama })
    //   });
    //   let dtl = [];
    //   dtl = this.HrmsPengajuanCuti.detail;
    //   for (let index = 0; index < dtl.length; index++) {
    //     const d = dtl[index];
    //     this.addBlok(d['item_id'], d['qty'],  d['ket'],d['id']);
    //   }
    // });

    // let selectedKaryawan;
    // this.KaryawanService.getAll().subscribe(x=>{
    //   this.dataSelectKaryawan=[];
    //   x['data'].forEach(d => {
    //     this.dataSelectKaryawan.push({"id":d.id,"text":d.nama+"("+d.nama+")"});

    //   });

    // });

    this.dataSelectKode = [
      { id: 'PC1', text: 'PC1' },
      { id: 'PC2', text: 'PC2' },
      { id: 'PC3', text: 'PC3' },
      { id: 'PC4', text: 'PC4' },
      { id: 'PC5', text: 'PC5' },
      { id: 'PC6', text: 'PC6' },
    ];

    // let selectedKode;
    // this.dataSelectKode.forEach(d => {
    //   if (this.HrmsPengajuanCuti.kode == d.id) {
    //     selectedKode = { "id": d.id, "text": d.text }
    //   }
    // });
    // this.entryForm.get('kode_id').patchValue(selectedKode);

    // let selectedSimbol;
    // this.dataSelectSimbol.forEach(d => {
    //   if (this.HrmsPengajuanCuti.simbol == d.id) {
    //     selectedSimbol = d;
    //   }
    // });
    // this.entryForm.get("simbol").patchValue(selectedSimbol);

  }

  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };

  onSubmit(){
    console.log(this.entryForm);

    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }


    let frmData = this.entryForm.value;
    frmData['status']=this.entryForm.get('status').value;
    frmData['is_finish']=1;
    frmData['note_approve']=this.entryForm.get('note_approve').value;;
    frmData['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');
    console.log(frmData);

    this.HrmsPengajuanCutiService.approve(this.HrmsPengajuanCuti.id,frmData).subscribe(data=>{
      console.log(data);
      if( data['status']=='OK'){
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Data berhasil diSimpan',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        this.event.emit('OK');
        this.bsModalRef.hide();
      }
    });
  }

  reject() {
    console.log(this.entryForm);

    this.isFormSubmitted = true;
    // let frmData=new FormData();
    // if (this.entryForm.invalid) {
    //   return;
    // }


    let frmData = this.entryForm.value;
    frmData['status'] = this.entryForm.get('status').value;
    frmData['note_approve'] = this.entryForm.get('note_approve').value;;
    frmData['is_ready_po'] = 0;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    console.log(frmData);

    this.HrmsPengajuanCutiService.reject(this.HrmsPengajuanCuti.id, frmData).subscribe(data => {
      console.log(data);
      // if (data['status'] == 'OK') {
      //   console.log('ok');
      swal({
        title: 'Info!',
        text: 'Data berhasil diSimpan',
        type: 'success',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      })
       this.event.emit('OK');
         this.bsModalRef.hide();
      // }
    });
  }

  onClose(){
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();

    // console.log(this.HrmsPengajuanCuti);
    // this.entryForm = this.builder.group({
    //   nip: new FormControl(this.HrmsPengajuanCuti.nip,[Validators.required]),
    //   nama: new FormControl(this.HrmsPengajuanCuti.nama, [Validators.required]),
    //   jenis_kelamin: new FormControl(this.HrmsPengajuanCuti.jenis_kelamin, [Validators.required]),
    //   tgl_lahir:   new FormControl(new Date(Date.parse(this.HrmsPengajuanCuti.tgl_lahir)), Validators.required),
    //   tempat_lahir: new FormControl(this.HrmsPengajuanCuti.tempat_lahir, []),
    //   alamat: new FormControl(this.HrmsPengajuanCuti.alamat, []),
    //   username: new FormControl(this.HrmsPengajuanCuti.username, []),
    //   password: new FormControl(this.HrmsPengajuanCuti.password, []),
    // });


  }
  valueChange($event){
    console.log($event);

  //  let selectedOptions = $event.target['options'];
  //  let selectedIndex = selectedOptions.selectedIndex;
  // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }

  statusChange($event) {
    this.status_id  = $event.value;
    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;
  }
  download(id) {
    this.HrmsPengajuanCutiService.getById(id).subscribe(data => {
      // console.log(data);
      let filename=data['data']['file_info']['name']
     this.HrmsPengajuanCutiService.download(id, filename);
    });
  }
}
