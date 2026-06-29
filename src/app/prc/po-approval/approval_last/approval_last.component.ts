import { Component, OnInit, EventEmitter, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";

import { PrcPo } from 'src/app/shared/models/prc_po.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { PrcPoService } from 'src/app/shared/services/prc_po.service';
import { formatDate } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { PrcPpService } from 'src/app/shared/services/prc_pp.service';
declare var swal: any;

@Component({
  moduleId: module.id,
  selector: 'pp-approval_last-cmp',
  styleUrls: ['approval_last.component.css'],
  templateUrl: 'approval_last.component.html'
})

export class ApprovalLastComponent implements OnInit,AfterViewInit{

  @ViewChild('if_purchase_order',{static:true}) iframe_purchase_order: ElementRef;
  @ViewChild('if_quotation',{static:true}) iframe_quotation: ElementRef;
    @ViewChild('if_purchase_request',{static:true}) iframe_purchase_request: ElementRef;

  isFormSubmitted=false;
  isChangePhoto=false;
	datepickerConfig = {
		dateInputFormat: 'DD-MM-YYYY',
		containerClass: 'theme-red'
	}
  entryForm: FormGroup;
  categories: any[] = [];
  event: EventEmitter<any>=new EventEmitter();
  PrcPo:PrcPo;
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
    private PrcPoService: PrcPoService,
    private PrcPpService: PrcPpService,
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
        no_po: new FormControl('', Validators.required),
        catatan: new FormControl(''),
        catatan_revisi: new FormControl(''),
        note_approve: new FormControl('', Validators.required),
        status: new FormControl('', Validators.required),
        status_id: new FormControl("1", Validators.required),
        details: this.builder.array([]),

      });




  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {

    // this.entryForm.controls['awal'].patchValue(this.PrcPo.awal);
    // this.entryForm.controls['akhir'].patchValue(this.PrcPo.akhir);
    this.entryForm.controls['no_po'].patchValue(this.PrcPo.no_po);
    this.entryForm.controls['catatan'].patchValue(this.PrcPo.catatan);
    this.entryForm.controls['catatan_revisi'].patchValue(this.PrcPo.catatan_revisi);
    this.entryForm.controls['status'].patchValue(this.PrcPo.last_approve_position);

    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.PrcPo.tanggal)));

    this.PrcPoService.getPdfSlip(this.PrcPo.id).subscribe(
      (res) => {
        // console.log(res);
        var fileURL = URL.createObjectURL(res);
        // document.querySelector("iframe").src = fileURL;
        this.iframe_purchase_order.nativeElement.src=fileURL;
      }
    );
    this.iframe_quotation.nativeElement.src=this.PrcPo['quotation_link_file'];

        if (this.PrcPo.detail && this.PrcPo.detail.length > 0) {

      var ids = [];

      for (var i = 0; i < this.PrcPo.detail.length; i++) {

        var d: any = this.PrcPo.detail[i]; // 🔥 FIX disini

        if (d && d.pp_hd_id) {
          ids.push(d.pp_hd_id);
        }
      }

      var uniqueIds = [];
      for (var i = 0; i < ids.length; i++) {
        if (uniqueIds.indexOf(ids[i]) === -1) {
          uniqueIds.push(ids[i]);
        }
      }

      if (uniqueIds.length > 0) {

        this.PrcPpService.getPdfSlipMulti(uniqueIds)
          .subscribe((res: Blob) => {
            var fileURL = URL.createObjectURL(res);
            this.iframe_purchase_request.nativeElement.src = fileURL;
          });

      }

    }
  }
  public options: any;


  private loadSelect2(): void {


    // let selectedLokasi;
    // this.GbmOrganisasiService.getAllByType("UNIT").subscribe(x=>{
    //   this.dataSelectLokasi=[];
    //   x.forEach(d => {
    //     this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
    //     if (this.PrcPo.lokasi_id == d.id) {
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
    //   dtl = this.PrcPo.detail;
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
      { id: 'PO1', text: 'PO1' },
      { id: 'PO2', text: 'PO2' },
      { id: 'PO3', text: 'PO3' },
      { id: 'PO4', text: 'PO4' },
      { id: 'PO5', text: 'PO5' },
      { id: 'PO6', text: 'PO6' },
    ];

    // let selectedKode;
    // this.dataSelectKode.forEach(d => {
    //   if (this.PrcPo.kode == d.id) {
    //     selectedKode = { "id": d.id, "text": d.text }
    //   }
    // });
    // this.entryForm.get('kode_id').patchValue(selectedKode);

    // let selectedSimbol;
    // this.dataSelectSimbol.forEach(d => {
    //   if (this.PrcPo.simbol == d.id) {
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

    this.PrcPoService.approve(this.PrcPo.id,frmData).subscribe(data=>{
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


  onClose(){
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();

    // console.log(this.PrcPo);
    // this.entryForm = this.builder.group({
    //   nip: new FormControl(this.PrcPo.nip,[Validators.required]),
    //   nama: new FormControl(this.PrcPo.nama, [Validators.required]),
    //   jenis_kelamin: new FormControl(this.PrcPo.jenis_kelamin, [Validators.required]),
    //   tgl_lahir:   new FormControl(new Date(Date.parse(this.PrcPo.tgl_lahir)), Validators.required),
    //   tempat_lahir: new FormControl(this.PrcPo.tempat_lahir, []),
    //   alamat: new FormControl(this.PrcPo.alamat, []),
    //   username: new FormControl(this.PrcPo.username, []),
    //   password: new FormControl(this.PrcPo.password, []),
    // });


  }
  valueChange($event){
    console.log($event);

  //  let selectedOptions = $event.target['options'];
  //  let selectedIndex = selectedOptions.selectedIndex;
  // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }

 getUOM(form) {
    this.dataItem.forEach(x=> {
      if (x.id == form.get('item').value.id) {
        form.get('uom').patchValue(x.uom);
      }
    });
  }
  statusChange($event) {
    this.status_id  = $event.value;
    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;
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

    this.PrcPoService.reject(this.PrcPo.id, frmData).subscribe(data => {
      console.log(data);
      // if (data['status'] == 'OK') {
      //   console.log('ok');
       this.event.emit('OK');
         this.bsModalRef.hide();
      // }
    });
  }

}
