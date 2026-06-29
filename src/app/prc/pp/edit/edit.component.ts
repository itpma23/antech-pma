import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { PrcPp } from 'src/app/shared/models/prc_pp.model';
import { PksTankiService } from 'src/app/shared/services/pks_tanki.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { PrcPpService } from 'src/app/shared/services/prc_pp.service';
import { formatDate, formatNumber } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { InvLaporanService } from 'src/app/shared/services/inv_laporan.service';
import { isNullOrUndefined, isNumber, isString } from 'util';
declare var $: any;
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'edit-cmp',
  styleUrls: ['edit.component.css'],
  templateUrl: 'edit.component.html'
})

export class EditComponent implements OnInit,AfterViewInit{
  isFormSubmitted=false;
  isChangePhoto=false;
	datepickerConfig = {
		dateInputFormat: 'DD-MM-YYYY',
		containerClass: 'theme-red'
	}
  entryForm: FormGroup;
  categories: any[] = [];
  event: EventEmitter<any>=new EventEmitter();
  PrcPp:PrcPp;
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

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private PrcPpService: PrcPpService,
    private authenticationService: AuthenticationService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private KaryawanService: KaryawanService,
    private InvItemService: InvItemService,
    private invLaporanService: InvLaporanService,
    ) {
      this.dbName= this.authenticationService.getUserDB();
      this.pathName= this.authenticationService.getUserPath();
      this.PATH_URL=SERVER_PATH_URL;

      let toDate: Date = new Date();

      this.entryForm = this.builder.group({

        lokasi_id: new FormControl([], Validators.required),
        tanggal: new FormControl(toDate, Validators.required),
        no_pp: new FormControl('', Validators.required),
        catatan: new FormControl('', Validators.required),

        details: this.builder.array([]),

      });




  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {

    // this.entryForm.controls['awal'].patchValue(this.PrcPp.awal);
    // this.entryForm.controls['akhir'].patchValue(this.PrcPp.akhir);
    this.entryForm.controls['no_pp'].patchValue(this.PrcPp.no_pp);
    this.entryForm.controls['catatan'].patchValue(this.PrcPp.catatan);

    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.PrcPp.tanggal)));


  }
  public options: any;


  private loadSelect2(): void {

    // let selectedtanki;
    // this.PksTankiService.getAll().subscribe(x=>{
    //   this.dataSelectTanki=[];
    //   x['data'].forEach(d => {
    //     this.dataSelectTanki.push({"id":d.id,"text":d.nama_tanki});
    //     if (this.PrcPp.tanki_id == d.id) {
    //       selectedtanki = { "id": d.id, "text": d.nama_tanki }
    //     }
    //   });
    //   this.entryForm.get('tanki_id').patchValue(selectedtanki);
    // });

    let selectedLokasi;
    this.GbmOrganisasiService.getAllByType("UNIT").subscribe(x=>{
      this.dataSelectLokasi=[];
      x.forEach(d => {
        this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
        if (this.PrcPp.lokasi_id == d.id) {
          selectedLokasi = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectedLokasi);
    });

    let selectedItem;
    this.InvItemService.getAll().subscribe(x=>{
      this.dataSelectItem=[];
      this.dataItem = x['data'];
      // console.log(this.dataItem);
      x['data'].forEach(d => {
        this.dataSelectItem.push({"id":d.id,"text":d.kode+" - "+d.nama })
      });
      let dtl = [];
      dtl = this.PrcPp.detail;
      for (let index = 0; index < dtl.length; index++) {
        const d = dtl[index];
        this.addBlok(d['item_id'], d['qty'],  d['ket']);
      }
    });

    // let selectedKaryawan;
    // this.KaryawanService.getAll().subscribe(x=>{
    //   this.dataSelectKaryawan=[];
    //   x['data'].forEach(d => {
    //     this.dataSelectKaryawan.push({"id":d.id,"text":d.nama});
    //     if (this.PrcPp.karyawan_id == d.id) {
    //       selectedKaryawan = { "id": d.id, "text": d.nama }
    //     }
    //   });
    //   this.entryForm.get('karyawan_id').patchValue(selectedKaryawan);
    // });

    this.dataSelectKode = [
      { id: 'PP1', text: 'PP1' },
      { id: 'PP2', text: 'PP2' },
      { id: 'PP3', text: 'PP3' },
      { id: 'PP4', text: 'PP4' },
      { id: 'PP5', text: 'PP5' },
      { id: 'PP6', text: 'PP6' },
    ];
    // let selectedKode;
    // this.dataSelectKode.forEach(d => {
    //   if (this.PrcPp.kode == d.id) {
    //     selectedKode = { "id": d.id, "text": d.text }
    //   }
    // });
    // this.entryForm.get('kode_id').patchValue(selectedKode);

    // let selectedSimbol;
    // this.dataSelectSimbol.forEach(d => {
    //   if (this.PrcPp.simbol == d.id) {
    //     selectedSimbol = d;
    //   }
    // });
    // this.entryForm.get("simbol").patchValue(selectedSimbol);

  }

  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };
  addBlok(item_id, qty, ket) {
    // this.details.push(this.builder.group(new InvoiceBlok()));
    let selectedItem=[];
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
      item: new FormControl(selectedItem, Validators.required),
      uom: new FormControl(uom),
      qty: new FormControl(formatNumber(qty, 'en_US', '1.2-2'), Validators.required),
      ket: new FormControl(ket),
    }));
  }
  addValueChange(form)
  {
    if (isString(form.get('qty').value)) {
      form.get('qty').patchValue(formatNumber(form.get('qty').value, 'en_US', '1.2-2'));
    }
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
      sub=sub+ parseFloat( i.qty);
    }
    // console.log(sub);
    //this.entryForm.get('total').patchValue( sub);
  }
  cekStok(item) {

    let tanggal = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    let lokasi_id = (this.entryForm.get('lokasi_id').value['id']);
    let item_id = item.get('item').value['id'];
    let barang = item.get('item').value['text'];
    console.log(lokasi_id+'/'+item_id+'/'+tanggal)
    this.invLaporanService.cekStokByLokasi(lokasi_id,item_id,tanggal).subscribe(d=>{
      let stok = 0
      // console.log(d['data'])
     if ( !isNullOrUndefined(d['data'])  ){
      stok=d['data']['stok'];
     }
      swal({
        title: 'Stok : ' + stok,
        text: 'Item ' + barang,
        type: 'success',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      })
    })



  }
  onSubmit(){
    // console.log(this.entryForm);

    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      swal({
        title: 'Perhatian!',
        text: 'Data belum lengkap!',
        type: 'warning',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
        })
      return;
    }


    let frmData = this.entryForm.value;
    frmData['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');
    this.entryForm.get('details').value.forEach(x => {
      if (!isNumber(x.qty)){
        x.qty= parseFloat(x.qty.replace(/[^\d\.\-]/g, ""));
      }
    });

    this.PrcPpService.update(this.PrcPp.id,frmData).subscribe(data=>{
      console.log(data);
      if( data['status']=='OK'){
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Data berhasil diSimpan.',
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
