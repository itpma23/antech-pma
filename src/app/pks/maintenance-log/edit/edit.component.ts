import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { PksMaintenanceLog } from 'src/app/shared/models/pks_maintenance_log';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { PksMaintenanceLogService } from 'src/app/shared/services/pks_maintenance_log.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { PksJenisMaintenanceService } from 'src/app/shared/services/pks_jenis_maintenance.service';
import { PksTimbanganService } from 'src/app/shared/services/pks_timbangan.service';
declare var $: any;
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'edit-cmp',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.css'],
})

export class EditComponent implements OnInit, AfterViewInit {
  isFormSubmitted = false;
  isChangePhoto = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();
  public dataSelectMesin: any[] = [];
  public dataSelectJenis: any[] = [];
  public dataSelectTimbangan: any[] = [];
  public dataSelectSparepart: any[] = [];

  pksMaintenanceLog: PksMaintenanceLog;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private pksMaintenanceLogService: PksMaintenanceLogService,
    private pksJenisMaintenanceService: PksJenisMaintenanceService,
    private InvItemService: InvItemService,
    private GbmOrganisasiService: GbmOrganisasiService


  ) {

    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      tanggal: new FormControl(toDate, Validators.required),
      mesin_id: new FormControl([], Validators.required),
      jenis_maintenance_id: new FormControl([], Validators.required),
      hm_km: new FormControl(0, Validators.required),
      ket: new FormControl('', Validators.required),
      details: this.builder.array([]),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    console.log(this.pksMaintenanceLog);

    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.pksMaintenanceLog.tanggal)));
 this.entryForm.controls['hm_km'].patchValue(this.pksMaintenanceLog.hm_km);
    this.entryForm.controls['ket'].patchValue(this.pksMaintenanceLog.ket);

  }
  private loadSelect2(): void {



    let selectMesin;
    this.GbmOrganisasiService.getAllByType('MESIN').subscribe(x => {
      this.dataSelectMesin = [];
      x.forEach(d => {
        this.dataSelectMesin.push({ "id": d.id, "text": d.kode  +' - '+ d.nama});
      });
      this.dataSelectMesin.forEach(a => {
        if (a.id == this.pksMaintenanceLog.mesin_id) {
          selectMesin = a;
        }
      });
      this.entryForm.controls['mesin_id'].patchValue(selectMesin);
    });

    let selectJenis;
    this.pksJenisMaintenanceService.getAll().subscribe(x => {
      this.dataSelectJenis = [];
      x['data'].forEach(d => {
        this.dataSelectJenis.push({ "id": d.id, "text": d.kode+" - "+d.keterangan });
      });
      this.dataSelectJenis.forEach(a => {
        if (a.id == this.pksMaintenanceLog.jenis_maintenance_id) {
          selectJenis = a;
        }
        this.entryForm.controls['jenis_maintenance_id'].patchValue(selectJenis);
      });
    });


    this.InvItemService.getAllSukuCadang().subscribe(x=>{
      console.log(x);
      this.dataSelectSparepart=[];
      x['data'].forEach(d => {
        this.dataSelectSparepart.push({"id":d.id,"text":d.nama +' - '+d.kode});
      });
      let dtl = this.pksMaintenanceLog.detail;
      for (let index = 0; index < dtl.length; index++) {
        const d = dtl[index];
        this.addBlok(d['sparepart_id'], d['qty']);
      }
    });

  }


  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };

  addBlok(sparepart_id , qty = 0) {
    // this.details.push(this.builder.group(new InvoiceItem()));
    let selectedSparepart=[];
    this.dataSelectSparepart.forEach(a => {
      if (sparepart_id == a.id) {
        selectedSparepart =a;
      }
    });

    this.details.push(this.builder.group({
      sparepart_id: new FormControl(selectedSparepart, Validators.required),
      qty: new FormControl(qty, Validators.required),
    }));
    // this.details.push(fb);
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
  }
  updateForm(data) {
    // console.log(data.details);
    const items = data.details;
    console.log(items);
    let sub = 0;
    for(let i of items){
      sub=sub+ parseFloat( i.qty);

    }
    console.log(sub);
    //this.entryForm.get('total').patchValue( sub);

  }

  onSubmit() {
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }
    let dataSubmit = this.entryForm.value;
    // console.log(this.entryForm.value);
    dataSubmit['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');
    console.log(dataSubmit);
    this.pksMaintenanceLogService.update(this.pksMaintenanceLog.id, dataSubmit).subscribe(data => {

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



  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {

    this.loadSelect2();

  }
  valueChange($event) {
    console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.entryForm.patchValue({
      img: file
    });
    this.entryForm.get('img').updateValueAndValidity();
    this.isChangePhoto = true;
    console.log(this.isChangePhoto);
  }
}
