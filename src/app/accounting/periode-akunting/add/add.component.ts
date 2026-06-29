import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { AccPeriodeAkuntingService } from 'src/app/shared/services/acc_periode_akunting.service';
import { HrmsLokasiService } from 'src/app/shared/services/hrms_lokasi.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';

declare var swal: any;
declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'add-absensi-cmp',
  templateUrl: 'add.component.html'
})

export class AddComponent implements OnInit, AfterViewInit {
  bsConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'YYYY-MM-DD',

    containerClass: 'theme-dark-blue'
  };
  editor_modules: any;
  isFormSubmitted = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }

  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();
  karyawan_id;
  hari_id;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private karyawanService: KaryawanService,
    private accPeriodeAkuntingService: AccPeriodeAkuntingService,
    private hrmsLokasiService: HrmsLokasiService,
    private translate: TranslateService,
    private gbmOrganisasiService: GbmOrganisasiService,


  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();
    this.entryForm = this.builder.group({
      lokasi_id: new FormControl([], Validators.required),
      tgl_awal: new FormControl(toDate, Validators.required),
      tgl_akhir: new FormControl(toDate, Validators.required),
      nama: new FormControl('', []),
      status: new FormControl('0', []),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    this.loadSelect2();
  }
  public dataSelectLokasi: any[] = [];
  public dataSelectKaryawan: any[] = [];
  public options: any;

  private loadSelect2(): void {
    this.gbmOrganisasiService.getAllByType("UNIT").subscribe(x=>{
      this.dataSelectLokasi=[];
      x.forEach(d => {
        this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
      });
    });

  }
  onSubmit() {
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    let frmData = new FormData();
    frmData.append('tgl_awal',formatDate(this.entryForm.get('tgl_awal').value, "yyy-MM-dd", "en_US"));
    frmData.append('tgl_akhir',formatDate(this.entryForm.get('tgl_akhir').value, "yyy-MM-dd", "en_US"));
    frmData.append('nama',this.entryForm.get('nama').value);
    frmData.append('status', this.entryForm.get('status').value);
    frmData.append('lokasi_id', this.entryForm.get('lokasi_id').value['id']);

    this.accPeriodeAkuntingService.create(frmData).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        console.log('ok');
        this.event.emit('OK');
        this.bsModalRef.hide();
      }else {
        swal({
          title: 'Proses Simpan Gagal!',
          text: '' + data['data'],
          type: 'warning',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
      }
    });
  }

  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.entryForm.patchValue({
      img: file
    });
    this.entryForm.get('img').updateValueAndValidity()
    console.log(file);
  }
  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();

  }

  valueChange(event) {
    // console.log(event);

    // this.kelasService.getMapelKelasOnly(event.id).subscribe(x => {
    //   // console.log(x);
    //   this.dataSelectMapelKelas = [];
    //   let mapelKelas = x['data'];
    //   // console.log(mapelKelas)
    //   mapelKelas.forEach(m => {
    //     this.dataSelectMapelKelas.push({ "id": m.mapel_kelas_id, "text": m.nama });

    //   });

    // });

  }
}
