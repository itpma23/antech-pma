import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { PksPengolahanService } from 'src/app/shared/services/pks_pengolahan.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { PksShiftService } from 'src/app/shared/services/pks_shift.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';

declare var $: any;
declare var swal: any;

@Component({
  moduleId: module.id,
  selector: 'add-cmp',
  templateUrl: 'add.component.html',
  styleUrls: ['add.component.css'],
})

export class AddComponent implements OnInit, AfterViewInit {
  editor_modules: any;
  isFormSubmitted = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }

  entryForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();


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
    private PksPengolahanService: PksPengolahanService,
    private GbmOrganisasiService:GbmOrganisasiService,
    private KaryawanService:KaryawanService,
    private PksShiftService:PksShiftService,
    private InvItemService: InvItemService,

    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      no_transaksi: new FormControl('(Auto Generate)'),
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
    // this.addBlok('mesin');
    this.addBlok();
  }
  public options: any;

  private loadSelect2(): void {

    // this.GbmOrganisasiService.getAllByType('MESIN').subscribe(x=>{
    //   this.dataSelectDivisi=[];
    //   x.forEach(d => {
    //     this.dataSelectDivisi.push({"id":d.id,"text":d.nama});
    //   });
    // });

    this.GbmOrganisasiService.getAllByType('MILL').subscribe(x=>{

      this.dataSelectMill=[];
      x.forEach(d => {
        this.dataSelectMill.push({"id":d.id,"text":d.nama});
      });

    });


    this.GbmOrganisasiService.getAllByType('MESIN').subscribe(x=>{
      this.dataSelectMesin=[];
      x.forEach(d => {
        this.dataSelectMesin.push({"id":d.id,"text":d.kode+" - "+d.nama});
      });
    })
    this.PksShiftService.getAll().subscribe(x=>{
      this.dataSelectShift=[];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectShift.push({"id":d.id,"text":d.nama});
      });
    });
    this.KaryawanService.getAll().subscribe(x=>{
      this.dataSelectMandor=[];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectMandor.push({"id":d.id,"text":d.nama});
      });
    });
    this.KaryawanService.getAll().subscribe(x=>{
      this.dataSelectAsisten=[];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectAsisten.push({"id":d.id,"text":d.nama});
      });
    });
    this.InvItemService.getAll().subscribe(x=>{
      console.log(x);
      this.dataSelectItem=[];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectItem.push({"id":d.id,"text":d.kode+" - "+d.nama});
      });
    });

  }
  onSubmit() {
    this.isFormSubmitted = true;

    console.log(this.entryForm);

    if (this.entryForm.invalid) {
      return;
    }

    
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

    // console.log(frmData);
    this.PksPengolahanService.create(frmData).subscribe(data => {
      if (data['status'] == 'OK') {
        swal({
          title: 'Info!',
          text: 'Data berhasil disimpan dengan Nomor:'+data['data'],
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
  // get details_item(): FormArray {
  //   return this.entryForm.get('details_item') as FormArray;
  // };


  addBlok() {
    let time: Date = new Date();

    this.details.push(this.builder.group({
      shift_id: new FormControl([], Validators.required),
      mandor_id: new FormControl([], Validators.required),
      asisten_id: new FormControl([], Validators.required),
      jam_masuk: new FormControl(time, Validators.required),
      jam_selesai: new FormControl(time, Validators.required),
      jam_proses: new FormControl(0, Validators.required),
      jumlah_rebusan: new FormControl(0, Validators.required),
    }));

    // this.valueChange();
  }
  addBlokMesin() {
    let time: Date = new Date();

    this.details_mesin.push(this.builder.group({
      mesin_id: new FormControl([], Validators.required),
      jam_masuk: new FormControl(time, Validators.required),
      jam_selesai: new FormControl(time, Validators.required),
      jumlah_jam: new FormControl(0, Validators.required),
      keterangan: new FormControl('', Validators.required),
    }));

    // this.valueChange();
  }
  // addBlokItem() {
  //   this.details_item.push(this.builder.group({
  //     item: new FormControl([], Validators.required),
  //     qty: new FormControl('', Validators.required),
  //     no_issue: new FormControl('', Validators.required),
  //     harga: new FormControl('', Validators.required),
  //   }));
  // }

  removeBlok(Blok, nick='mesin') {
    let i = this.details.controls.indexOf(Blok);
    if(i != -1) {
    //  let x=	this.details.controls.splice(i, 1);
      let bloks = this.entryForm.get('details') as FormArray;
      bloks.removeAt(i);
      let data = {details: bloks.value};
      this.updateForm(data);
    }

    // this.valueChange();
  }
  removeBlokMesin(Blok, nick='mesin') {
    let i = this.details_mesin.controls.indexOf(Blok);
    if(i != -1) {
    //  let x=	this.details.controls.splice(i, 1);
      let bloks = this.entryForm.get('details_mesin') as FormArray;
      bloks.removeAt(i);
      let data = {details_mesin: bloks.value};
      this.updateForm(data);
    }

    // this.valueChange();
  }
  // removeBlokItem( blok ) {
  //   let i = this.details_item.controls.indexOf(blok);
  //   if(i != -1) {
  //     let detail = this.entryForm.get('details_item') as FormArray;
  //     detail.removeAt(i);
  //     let data = {details_item: detail.value};
  //     this.updateForm(data);
  //   }
  // }


  updateForm(data) {
    // const bloks = data.details;
    // let sub = 0;
    // for(let i of bloks){
    //   sub=sub+ parseFloat( i.jumlah_janjang);
    // }
    // // console.log(sub);
    //this.entryForm.get('total').patchValue( sub);

  }
  recalculate(){
    // let bloks = this.entryForm.get('details') as FormArray;
    // let data = { details: bloks.value };
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
    let jam_masuk = form.get('jam_masuk').value;
    let jam_selesai = form.get('jam_selesai').value;
    console.log(jam_masuk+" --- "+jam_selesai);
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
