import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { PksPengolahanService } from 'src/app/shared/services/pks_pengolahan.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { PksShiftService } from 'src/app/shared/services/pks_shift.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { PksPengolahan } from 'src/app/shared/models/pks_pengolahan.model';
import { InvItemService } from 'src/app/shared/services/inv_item.service';

declare var $: any;
declare var swal: any;

@Component({
  moduleId: module.id,
  selector: 'edit-cmp',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.css'],
})

export class EditComponent implements OnInit, AfterViewInit {
  editor_modules: any;
  isFormSubmitted = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }

  entryForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();

pengolahan:PksPengolahan;
dataSelectDetail;
dataSelectDivisi;
dataSelectBlok;
dataSelectMesin;
dataSelectShift;
dataSelectMandor;
dataSelectAsisten;
dataSelectItem;
  dataSelectMill: any[];

constructor(private builder: FormBuilder,
  private bsModalRef: BsModalRef,
  private pksPengolahanService: PksPengolahanService,
  private gbmOrganisasiService:GbmOrganisasiService,
  private KaryawanService:KaryawanService,
  private PksShiftService:PksShiftService,
  private InvItemService: InvItemService,

  private translate: TranslateService,
) {
  let toDate: Date = new Date();
  let time: Date = new Date();

  this.entryForm = this.builder.group({
    no_transaksi: new FormControl(''),
    mill_id: new FormControl([], Validators.required),
    total_jam_proses: new FormControl(0, Validators.required),
    total_jumlah_rebusan: new FormControl(0, Validators.required),
    tbs_olah: new FormControl(0, Validators.required),

    tanggal: new FormControl(toDate, Validators.required),

    details: this.builder.array([]),
    details_mesin: this.builder.array([]),


    cpo_moisture: new FormControl(0),
    cpo_dobi: new FormControl(0),
    cpo_ffa: new FormControl(0),
    cpo_dirt: new FormControl(0),
    
    kernel_moisture: new FormControl(0),
    kernel_dobi: new FormControl(0),
    kernel_ffa: new FormControl(0),
    kernel_dirt: new FormControl(0),
    
    cpo_los_fruit: new FormControl(0),
    cpo_los_press: new FormControl(0),
    cpo_los_nut: new FormControl(0),
    cpo_los_e_bunch: new FormControl(0),
    cpo_los_effluent: new FormControl(0),
    jml: new FormControl(0),
    jml1: new FormControl(0),

    kernel_los_fruit: new FormControl(0),
    kernel_los_fiber_cyclone: new FormControl(0),
    kernel_los_ltds1: new FormControl(0),
    kernel_los_ltds2: new FormControl(0),
    kernel_los_claybath: new FormControl(0),
  });
}
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    let date: Date = new Date();
    let strDate = formatDate(date, "yyyy-MM-dd", "en_US");

    this.entryForm.get('no_transaksi').patchValue(this.pengolahan.no_transaksi);

    // this.entryForm.get('jam_masuk').patchValue(strDate + " " + this.pengolahan.jam_masuk);
    // this.entryForm.get('jam_selesai').patchValue(strDate + " " + this.pengolahan.jam_selesai);

    this.entryForm.get('total_jam_proses').patchValue(this.pengolahan.total_jam_proses);
    this.entryForm.get('total_jumlah_rebusan').patchValue(this.pengolahan.total_jumlah_rebusan);
    this.entryForm.get('tbs_olah').patchValue(this.pengolahan.tbs_olah);

    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.pengolahan.tanggal)));

    this.entryForm.controls['cpo_moisture'].patchValue(this.pengolahan.cpo_moisture);
    this.entryForm.controls['cpo_dobi'].patchValue(this.pengolahan.cpo_dobi);
    this.entryForm.controls['cpo_ffa'].patchValue(this.pengolahan.cpo_ffa);
    this.entryForm.controls['cpo_dirt'].patchValue(this.pengolahan.cpo_dirt);

    this.entryForm.controls['kernel_moisture'].patchValue(this.pengolahan.kernel_moisture);
    this.entryForm.controls['kernel_dobi'].patchValue(this.pengolahan.kernel_dobi);
    this.entryForm.controls['kernel_ffa'].patchValue(this.pengolahan.kernel_ffa);
    this.entryForm.controls['kernel_dirt'].patchValue(this.pengolahan.kernel_dirt);

    this.entryForm.controls['cpo_los_fruit'].patchValue(this.pengolahan.cpo_los_fruit);
    this.entryForm.controls['cpo_los_press'].patchValue(this.pengolahan.cpo_los_press);
    this.entryForm.controls['cpo_los_nut'].patchValue(this.pengolahan.cpo_los_nut);
    this.entryForm.controls['cpo_los_e_bunch'].patchValue(this.pengolahan.cpo_los_e_bunch);
    this.entryForm.controls['cpo_los_effluent'].patchValue(this.pengolahan.cpo_los_effluent);

    this.entryForm.controls['kernel_los_fruit'].patchValue(this.pengolahan.kernel_los_fruit);
    this.entryForm.controls['kernel_los_fiber_cyclone'].patchValue(this.pengolahan.kernel_los_fiber_cyclone);
    this.entryForm.controls['kernel_los_ltds1'].patchValue(this.pengolahan.kernel_los_ltds1);
    this.entryForm.controls['kernel_los_ltds2'].patchValue(this.pengolahan.kernel_los_ltds2);
    this.entryForm.controls['kernel_los_claybath'].patchValue(this.pengolahan.kernel_los_claybath);

    this.valueChange(null);
  }
  public options: any;

  private loadSelect2(): void {
    console.log(this.pengolahan);

    let selectedMill;
    this.gbmOrganisasiService.getAllByType('MILL').subscribe(x=>{
      this.dataSelectMill=[];
      x.forEach(d => {
        this.dataSelectMill.push({"id":d.id,"text":d.nama});
        if (this.pengolahan.mill_id == d.id) {
          selectedMill = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('mill_id').patchValue(selectedMill);
    });

    this.gbmOrganisasiService.getAllByType('MESIN').subscribe(x=>{
      this.dataSelectMesin=[];
      x.forEach(d => {
        this.dataSelectMesin.push({"id":d.id,"text":d.kode+" - "+d.nama});
      });
      let dtl = [];
      dtl = this.pengolahan.detail_mesin;
      for (let index = 0; index < dtl.length; index++) {
        const d = dtl[index];
        this.addBlokMesin( d['mesin_id'], d['jam_masuk'], d['jam_selesai'],  d['keterangan']);
      }
    });

    this.PksShiftService.getAll().subscribe(x=>{
      this.dataSelectShift=[];
      x['data'].forEach(d => {
        this.dataSelectShift.push({"id":d.id,"text":d.nama});
      });
      this.KaryawanService.getAll().subscribe(x=>{
        this.dataSelectMandor=[];
        x['data'].forEach(d => {
          this.dataSelectMandor.push({"id":d.id,"text":d.nama});
        });
        this.KaryawanService.getAll().subscribe(x=>{
          this.dataSelectAsisten=[];
          x['data'].forEach(d => {
            this.dataSelectAsisten.push({"id":d.id,"text":d.nama});
          });
          let dtl = [];
          dtl = this.pengolahan.detail;
          for (let index = 0; index < dtl.length; index++) {
            const d = dtl[index];
            this.addBlok( d['shift_id'],  d['mandor_id'], d['asisten_id'], d['jam_masuk'], d['jam_selesai'], d['jam_proses'], d['jumlah_rebusan'] );
          }
        });
      });
    });





  }
  onSubmit() {
    // // console.log(this.entryForm.value);

    this.isFormSubmitted = true;

    if (this.entryForm.invalid) {
      return;
    }

    // let jam_masuk = formatDate(this.entryForm.get('jam_masuk').value, "HH:mm", "en_US");
    // let jam_selesai = formatDate(this.entryForm.get('jam_selesai').value, "HH:mm", "en_US");

    let frmData = this.entryForm.value;
    frmData['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');
    this.details.controls.forEach( (x,i)=>{
      frmData['details'][i]['jam_masuk'] = formatDate(x['controls']['jam_masuk'].value, "HH:mm", "en_US");
      frmData['details'][i]['jam_selesai'] = formatDate(x['controls']['jam_selesai'].value, "HH:mm", "en_US");
    });
    this.details_mesin.controls.forEach( (x,i)=>{
      frmData['details_mesin'][i]['jam_masuk'] = formatDate(x['controls']['jam_masuk'].value, "HH:mm", "en_US");
      frmData['details_mesin'][i]['jam_selesai'] = formatDate(x['controls']['jam_selesai'].value, "HH:mm", "en_US");
    });
    // frmData['jam_masuk']=jam_masuk;
    // frmData['jam_selesai']=jam_selesai;

    // // console.log(frmData);
    this.pksPengolahanService.update(this.pengolahan.id,frmData).subscribe(data => {
      if (data['status'] == 'OK') {
        swal({
          title: 'Info!',
          text: 'Data berhasil disimpan',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        this.event.emit('OK');
        this.bsModalRef.hide();
      } else {
        swal({
          title: 'Perhatian!',
          text: 'Proses Simpan Gagal',
          type: 'warning',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
      }
    });
  }

  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };
  get details_mesin(): FormArray {
    return this.entryForm.get('details_mesin') as FormArray;
  };
  get details_item(): FormArray {
    return this.entryForm.get('details_item') as FormArray;
  };

  // addBlokNew() {
  //   // this.details.push(this.builder.group(new InvoiceItem()));
  //   this.details.push(this.builder.group({
  //     mesin: new FormControl([], Validators.required),
  //     keterangan: new FormControl(''),
  //   }));
  // }

  addBlok(shift_id, mandor_id, asisten_id, jam_masuk, jam_selesai, jam_proses, jumlah_rebusan) {


    this.dataSelectShift;
    this.dataSelectMandor;
    this.dataSelectAsisten;

    let date: Date = new Date();
    let strDate = formatDate(date, "yyyy-MM-dd", "en_US");

    let selectedShift=[];
    this.dataSelectShift.forEach(a => {
      if (shift_id == a.id) {
        selectedShift = a;
      }
    });
    let selectedMandor=[];
    this.dataSelectMandor.forEach(a => {
      if (mandor_id == a.id) {
        selectedMandor = a;
      }
    });
    let selectedAsisten=[];
    this.dataSelectAsisten.forEach(a => {
      if (asisten_id == a.id) {
        selectedAsisten = a;
      }
    });
    let time: Date = new Date();
    let fb = this.builder.group({
      shift_id: new FormControl(selectedShift),
      mandor_id: new FormControl(selectedMandor),
      asisten_id: new FormControl(selectedAsisten),
      jam_masuk: new FormControl(new Date( strDate + " " + jam_masuk)),
      jam_selesai: new FormControl(new Date(strDate + " " + jam_selesai)),
      jam_proses: new FormControl(jam_proses),
      jumlah_rebusan: new FormControl(jumlah_rebusan),
    });


    this.details.push(fb);

    // this.valueChange();
  }
  addBlokMesin(  mesin_id, jam_masuk, jam_selesai, keterangan ) {

    let date: Date = new Date();
    let strDate = formatDate(date, "yyyy-MM-dd", "en_US");

    let selectedMesin=[];
    this.dataSelectMesin.forEach(a => {
      if (mesin_id == a.id) {
        selectedMesin = a;
      }
    });

    let fb = this.builder.group({
      mesin_id: new FormControl(selectedMesin),
      jam_masuk: new FormControl(strDate + " " + jam_masuk),
      jam_selesai: new FormControl(strDate + " " + jam_selesai),
      jumlah_jam: new FormControl(0),
      keterangan: new FormControl(keterangan),
    });

    this.details_mesin.push(fb);

    // this.valueChange();
  }


  removeBlok(item) {
    let i = this.details.controls.indexOf(item);
    if(i != -1) {
    // let x=	this.details.controls.splice(i, 1);
      let items = this.entryForm.get('details') as FormArray;
      items.removeAt(i);
    	let data = {details: items.value};
    	this.updateForm(data);
    }

    // this.valueChange();
  }
  removeBlokMesin(item) {
    let i = this.details_mesin.controls.indexOf(item);
    if(i != -1) {
    // let x=	this.details.controls.splice(i, 1);
      let items = this.entryForm.get('details_mesin') as FormArray;
      items.removeAt(i);
    	let data = {details: items.value};
    	this.updateForm(data);
    }

    // this.valueChange();
  }



  updateForm(data) {
    // const items = data.details;
    // // console.log(items);
    // let sub = 0;
    // for(let i of items){
    //   sub=sub+ parseFloat( i.qty);

    // }
    // // console.log(sub);
  }
  recalculate(){
    // let items = this.entryForm.get('details') as FormArray;
    // let data = { details: items.value };
    // this.updateForm(data);
  }
  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();
    // this.valueChange();
  }

  jumlah1(e){
    // let jml1 = this.entryForm.get('cpo_los_fruit').value + this.entryForm.get('cpo_los_press').value
    // this.entryForm.get('jml').patchValue(jml1)
    var n1 = this.entryForm.get('cpo_los_fruit').value;
    var n2 = this.entryForm.get('cpo_los_press').value;
    var n3 = this.entryForm.get('cpo_los_nut').value;
    var n4 = this.entryForm.get('cpo_los_e_bunch').value;
    var n5 = this.entryForm.get('cpo_los_effluent').value;
    this.entryForm.get('jml').patchValue( n1 + n2 + n3 + n4 + n5 );
  }
  jumlah2(e){
    // let jml1 = this.entryForm.get('cpo_los_fruit').value + this.entryForm.get('cpo_los_press').value
    // this.entryForm.get('jml').patchValue(jml1)
    var n1 = this.entryForm.get('kernel_los_fruit').value;
    var n2 = this.entryForm.get('kernel_los_fiber_cyclone').value;
    var n3 = this.entryForm.get('kernel_los_ltds1').value;
    var n4 = this.entryForm.get('kernel_los_ltds2').value;
    var n5 = this.entryForm.get('kernel_los_claybath').value;
    this.entryForm.get('jml1').patchValue( n1 + n2 + n3 + n4 + n5 );
  }
  valueChange($event) {
    // let jam_masuk = 0;
    // let jam_selesai = 0;
    // this.details.controls.forEach(x=>{
    //   let form = x;
    //   jam_masuk = x['controls']['jam_masuk'].value;
    //   jam_selesai = x['controls']['jam_selesai'].value;
    //   x['controls']['jam_masuk'].valueChanges.subscribe(x=>{
    //     jam_masuk = x;
    //     this.getJamProses(jam_masuk, jam_selesai, form);
    //   });
    //   x['controls']['jam_selesai'].valueChanges.subscribe(x=>{
    //     jam_selesai = x;
    //     this.getJamProses(jam_masuk, jam_selesai, form);
    //   });
    //   x['controls']['jam_proses'].valueChanges.subscribe(x=>{
    //     this.getTotalJamProses();
    //   });
    //   x['controls']['jumlah_rebusan'].valueChanges.subscribe(x=>{
    //     this.getTotalJumlahRebusan();
    //   });
    // });

    // let jam_masuk_mesin = 0;
    // let jam_selesai_mesin = 0;
    // this.details_mesin.controls.forEach(x=>{
    //   let form = x;
    //   jam_masuk_mesin = x['controls']['jam_masuk'].value;
    //   jam_selesai_mesin = x['controls']['jam_selesai'].value;
    //   x['controls']['jam_masuk'].valueChanges.subscribe(x=>{
    //     jam_masuk_mesin = x;
    //     this.getJamProsesMesin(jam_masuk_mesin, jam_selesai_mesin, form);
    //   });
    //   x['controls']['jam_selesai'].valueChanges.subscribe(x=>{
    //     jam_selesai_mesin = x;
    //     this.getJamProsesMesin(jam_masuk_mesin, jam_selesai_mesin, form);
    //   });
    // });
    this.jumlah1($event);
    this.jumlah2($event);
  }
  getJamProses(form) {
    console.log(form.value);
    let jam_masuk = form.get('jam_masuk').value;
    let jam_selesai = form.get('jam_selesai').value;
    // console.log(jam_masuk+" --- "+jam_selesai);
    if (jam_masuk < jam_selesai) {
      let x=jam_selesai.getTime()-jam_masuk.getTime();
      x=(x % 86400000) / 3600000;
      form.get('jam_proses').patchValue(x.toFixed(2));
      // console.log('jam masuk lebih kecil = '+x);
    }
    if (jam_masuk > jam_selesai) {
      let x= (86400000+jam_selesai.getTime())-jam_masuk.getTime();
      x=(x % 86400000) / 3600000;
      form.get('jam_proses').patchValue(x.toFixed(2));
      // console.log('jam masuk lebih besar = '+x);
    }
    this.getTotalJamProses();
  }
  getJamProsesMesin(form) {
    // console.log(jam_masuk+" --- "+jam_selesai);
    let jam_masuk = form.get('jam_masuk').value;
    let jam_selesai = form.get('jam_selesai').value;
    if (jam_masuk < jam_selesai) {
      let x=jam_selesai.getTime()-jam_masuk.getTime();
      x=(x % 86400000) / 3600000;
      form.get('jumlah_jam').patchValue(x.toFixed(2));
      // console.log('jam masuk lebih kecil = '+x);
    }
    if (jam_masuk > jam_selesai) {
      let x= (86400000+jam_selesai.getTime())-jam_masuk.getTime();
      x=(x % 86400000) / 3600000;
      form.get('jumlah_jam').patchValue(x.toFixed(2));
      // console.log('jam masuk lebih besar = '+x);
    }
    this.getTotalJumlahRebusan();
  }
  getTotalJamProses() {
    let total = 0;
    this.details.controls.forEach(form=>{
      total += parseFloat(form.get('jam_proses').value);
    });
    this.entryForm.get("total_jam_proses").patchValue(total);
  }
  getTotalJumlahRebusan() {
    let total = 0;
    this.details.controls.forEach(form=>{
      total += parseFloat(form.get('jumlah_rebusan').value);
    });
    this.entryForm.get("total_jumlah_rebusan").patchValue(total);
  }


}
