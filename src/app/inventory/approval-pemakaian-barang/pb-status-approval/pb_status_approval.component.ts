import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";

import { PrcPp } from 'src/app/shared/models/prc_pp.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { PrcPpService } from 'src/app/shared/services/prc_pp.service';
import { formatDate } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { InvPemakaianBarangOnlineService } from 'src/app/shared/services/inv_pemakaian_barang_online.service';
import { InvApprovalSettingPbService } from 'src/app/shared/services/inv_approvall_setting_pb.service';


@Component({
  moduleId: module.id,
  selector: 'pb-status-approval-cmp',
  styleUrls: ['pb_status_approval.component.css'],
  templateUrl: 'pb_status_approval.component.html'
})

export class PbStatusApprovalComponent implements OnInit,AfterViewInit{
  isFormSubmitted=false;
  isChangePhoto=false;
	datepickerConfig = {
		dateInputFormat: 'DD-MM-YYYY',
		containerClass: 'theme-red'
	}
  entryForm: FormGroup;
  event: EventEmitter<any>=new EventEmitter();
  InvPemakaianBarang;
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
namaKaryawan1;
namaKaryawan2;
namaKaryawan3;
namaKaryawan4;
namaKaryawan5;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private PrcPpService: PrcPpService,
    private authenticationService: AuthenticationService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private invPemakaianBarangService: InvPemakaianBarangOnlineService,
    private InvApprovalSettingPbService: InvApprovalSettingPbService,
    private karyawanService: KaryawanService,
    private InvItemService: InvItemService,
    ) {
      this.dbName= this.authenticationService.getUserDB();
      this.pathName= this.authenticationService.getUserPath();
      this.PATH_URL=SERVER_PATH_URL;

      let toDate: Date = new Date();

      this.entryForm = this.builder.group({
        karyawan_id: new FormControl([], Validators.required),
        lokasi_id: new FormControl([], Validators.required),
        tanggal: new FormControl(toDate, Validators.required),
        no_transaksi: new FormControl('', Validators.required),
        catatan: new FormControl(''),
        note_approve: new FormControl('', Validators.required),
        status: new FormControl('', Validators.required),

        details: this.builder.array([]),

      });




  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {

    // this.entryForm.controls['awal'].patchValue(this.PrcPp.awal);
    // this.entryForm.controls['akhir'].patchValue(this.PrcPp.akhir);
    this.entryForm.controls['no_transaksi'].patchValue(this.InvPemakaianBarang.no_transaksi);
    this.entryForm.controls['catatan'].patchValue(this.InvPemakaianBarang.catatan);
    this.entryForm.controls['status'].patchValue(this.InvPemakaianBarang.last_approve_position);

    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.InvPemakaianBarang.tanggal)));
    this.karyawanService.getById(this.InvPemakaianBarang['user_approve1']).subscribe(k=>{

      this.namaKaryawan1= k['data']['nama'];
    })
    this.karyawanService.getById(this.InvPemakaianBarang['user_approve2']).subscribe(k=>{

      this.namaKaryawan2= k['data']['nama'];
    })
    this.karyawanService.getById(this.InvPemakaianBarang['user_approve3']).subscribe(k=>{

      this.namaKaryawan3= k['data']['nama'];
    })
    this.karyawanService.getById(this.InvPemakaianBarang['user_approve4']).subscribe(k=>{

      this.namaKaryawan4= k['data']['nama'];
    })
    this.karyawanService.getById(this.InvPemakaianBarang['user_approve5']).subscribe(k=>{

      this.namaKaryawan5= k['data']['nama'];
    })

  }
  public options: any;


  private loadSelect2(): void {


    let selectedLokasi;
    this.GbmOrganisasiService.getAllByType("UNIT").subscribe(x=>{
      this.dataSelectLokasi=[];
      x.forEach(d => {
        this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
        if (this.InvPemakaianBarang.lokasi_id == d.id) {
          selectedLokasi = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectedLokasi);
    });

    let selectedItem;
    this.InvItemService.getAll().subscribe(x=>{
      this.dataSelectItem=[];
      this.dataItem = x['data'];
      x['data'].forEach(d => {
        this.dataSelectItem.push({"id":d.id,"text":d.kode+" - "+d.nama })
      });
      let dtl = [];
      dtl = this.InvPemakaianBarang.detail;
      for (let index = 0; index < dtl.length; index++) {
        const d = dtl[index];
        this.addBlok(d['item_id'], d['qty'],  d['ket'],d['id']);
      }
    });

    let selectedKaryawan;
    this.karyawanService.getAll().subscribe(x=>{
      this.dataSelectKaryawan=[];
      x['data'].forEach(d => {
        this.dataSelectKaryawan.push({"id":d.id,"text":d.nama+"("+d.nama+")"});

      });

    });

    this.dataSelectKode = [
      { id: 'PB1', text: 'PB1' },
      { id: 'PB2', text: 'PB2' },
      { id: 'PB3', text: 'PB3' },
      { id: 'PB4', text: 'PB4' },
      { id: 'PB5', text: 'PB5' },
      { id: 'PB6', text: 'PB6' },
    ];
    // let selectedKode;
    // this.dataSelectKode.forEach(d => {
    //   if (this.InvPemakaianBarang.kode == d.id) {
    //     selectedKode = { "id": d.id, "text": d.text }
    //   }
    // });
    // this.entryForm.get('kode_id').patchValue(selectedKode);

    // let selectedSimbol;
    // this.dataSelectSimbol.forEach(d => {
    //   if (this.InvPemakaianBarang.simbol == d.id) {
    //     selectedSimbol = d;
    //   }
    // });
    // this.entryForm.get("simbol").patchValue(selectedSimbol);

  }

  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };
  addBlok(item_id, qty, ket,id) {
    // this.details.push(this.builder.group(new InvoiceBlok()));
    let selectedItem;
    this.dataSelectItem.forEach(a => {
      if (item_id == a.id) {
        selectedItem =a;
      }
    });

    let uom;
    this.dataItem.forEach(x=> {
      if (item_id == x.id) {
        uom = x.uom;
      }
    });

    this.details.push(this.builder.group({
      id: new FormControl(id, Validators.required),
      item: new FormControl(selectedItem, Validators.required),
      uom: new FormControl(uom),
      qty: new FormControl(qty, Validators.required),
      ket: new FormControl(ket, Validators.required),
    }));
  }
  removeBlok(Blok) {
    let i = this.details.controls.indexOf(Blok);

    if(i != -1) {
    //  let x=	this.details.controls.splice(i, 1);
      let bloks = this.entryForm.get('details') as FormArray;
      bloks.removeAt(i);
    	let data = {details: bloks.value};
    	this.updateForm(data);
    }
  }
  updateForm(data) {
    const bloks = data.details;
    let sub = 0;
    for(let i of bloks){
      sub=sub+ parseFloat( i.jumlah_janjang);
    }
    console.log(sub);
    //this.entryForm.get('total').patchValue( sub);
  }

  onSubmit(){
    console.log(this.entryForm);

    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }


    let frmData = this.entryForm.value;
    frmData['status']=this.entryForm.get('status').value;
    frmData['note_approve']=this.entryForm.get('note_approve').value;;
    frmData['is_ready_po']=0;
    frmData['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');
    console.log(frmData);

    this.invPemakaianBarangService.approve(this.InvPemakaianBarang.id,frmData).subscribe(data=>{
      console.log(data);
      if( data['status']=='OK'){
        console.log('ok');
        this.event.emit('OK');
        this.bsModalRef.hide();
      }
    });
  }

getKaryawan(id){
  this.karyawanService.getById(id).subscribe(k=>{
    console.log(k)
    return k['data']['nama'];
  })
}
  onClose(){
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();

    // console.log(this.PrcPp);
    // this.entryForm = this.builder.group({
    //   nip: new FormControl(this.PrcPp.nip,[Validators.required]),
    //   nama: new FormControl(this.PrcPp.nama, [Validators.required]),
    //   jenis_kelamin: new FormControl(this.PrcPp.jenis_kelamin, [Validators.required]),
    //   tgl_lahir:   new FormControl(new Date(Date.parse(this.PrcPp.tgl_lahir)), Validators.required),
    //   tempat_lahir: new FormControl(this.PrcPp.tempat_lahir, []),
    //   alamat: new FormControl(this.PrcPp.alamat, []),
    //   username: new FormControl(this.PrcPp.username, []),
    //   password: new FormControl(this.PrcPp.password, []),
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
}
