import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { HrmsPengajuanCutiService } from 'src/app/shared/services/hrms_pengajuan_cuti.service';
import { TranslateService } from '@ngx-translate/core';
import { formatDate, formatNumber } from '@angular/common';
import { isNullOrUndefined, isNumber, isString } from 'util';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { UserService } from 'src/app/shared/services/user.service';
import { HrmsPengajuanCuti } from 'src/app/shared/models/hrms_pengajuan_cuti.model';

declare var $: any;
declare var swal: any;

interface Tipe {
  value: string;
  viewValue: string;
}
@Component({
  moduleId: module.id,
  selector: 'rincian-cmp',
  templateUrl: 'rincian.component.html',
})

export class RincianComponent implements OnInit, AfterViewInit {
  editor_modules: any;
  isFormSubmitted = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }

  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();


  data_karyawan: any;
  Rincian;

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private userService: UserService,
    private hrmsPengajuanCutiService: HrmsPengajuanCutiService,
    private authenticationService: AuthenticationService,

  ) {


    this.entryForm = this.builder.group({

      // lokasi_id: new FormControl([]),
      // saldo: new FormControl(''),
      // jenis_absensi_id: new FormControl([], Validators.required),
      // file: new FormControl(null, []),

    });

  }


  ngAfterViewInit(): void {
    // this.entryForm.get('saldo').patchValue(this.rincian.saldo);

  }

  private loadSelect2(): void {


    this.hrmsPengajuanCutiService.getRincianCuti().subscribe(res => {
      console.log(res)
      let data = {}
      this.Rincian = res['data'];
      // res['data'].forEach(d => { data = { nama: d }

      //   this.Rincian.push(data)

      // });



    });

  }

  getJumlah() {
    if (this.Rincian) {
      return this.Rincian.map(t => t.jumlah).reduce((jumlah, value) => parseFloat(jumlah) + parseFloat(value), 0);

    } else {
      return 0;

    }
  }
  onSubmit() {

  }


  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();

  }
  valueChange($event) {

  }





}
