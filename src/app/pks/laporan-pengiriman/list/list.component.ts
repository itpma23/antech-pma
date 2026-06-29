import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SERVER_API_URL } from 'src/app/app.constants';

import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { formatDate } from '@angular/common';

import { SlsKontrakService } from 'src/app/shared/services/sls_kontrak.service';
import { PksSjppService } from 'src/app/shared/services/pks_sjpp.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { GbmCustomerService } from 'src/app/shared/services/gbm_customer.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { PksTimbanganKirimService } from 'src/app/shared/services/pks_timbangan_kirim.service';
import { isNullOrUndefined } from 'util';
import { saveAs } from 'file-saver';
declare var swal: any;

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'list-cmp',
  templateUrl: 'list.component.html',
  styleUrls: ['list.css'],
})

export class ListComponent implements OnInit {
  isFormPengirimanDetailSubmitted = false;
  isFormAbsensiSubmitted = false;
  isFormLemburSubmitted = false;
  isFormPengirimanSubmitted = false;
  listKelas;
  dtOptions: any;
  private apiUrl = SERVER_API_URL;
  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  exportAsConfig: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'mytable',
  };
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }

  PengirimanForm: FormGroup;
  PengirimanDetailForm: FormGroup;
  // karyawanForm: FormGroup;
  // lemburForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();
  @ViewChild(DataTableDirective, { static: false })


  dataSelectCustomer;
  dataSelectTransportir;
  dataSelectMill;
  dataSelectBulan;
  dataSelectTahun;
  dataSelectKontrak;
  dataSelectSpk;


  bsModalRef: BsModalRef;
  dataSelectPeriode: any[];
  dataSelectProduk: any[];
  userProf: any;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,


    private translate: TranslateService,

    private SlsKontrakService: SlsKontrakService,
    private PksSjppService: PksSjppService,
    private pksTimbanganKirimService: PksTimbanganKirimService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private invItemService: InvItemService,
    private gbmCustomerService: GbmCustomerService,
    private gbmSupplierrService: GbmSupplierService,
    private builder: FormBuilder) {
      this.userProf = this.authenticationService.getUserProfile();
    let toDate: Date = new Date();



    this.PengirimanForm = this.builder.group({
      customer: new FormControl([],),
      kontrak: new FormControl([],),
      transportir: new FormControl([],),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),
      dibuat_oleh: new FormControl('',),
      disetujui_oleh: new FormControl('',),
    });
    this.PengirimanDetailForm = this.builder.group({
      customer: new FormControl([],),
      transportir: new FormControl([],),
      kontrak: new FormControl([],),
      produk_id: new FormControl([],),
      mill: new FormControl([], Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),
    });



  }

  ngOnInit() {
    this.loadSelect2();
    this.PengirimanForm.get('dibuat_oleh').patchValue( this.userProf['user_name']);


  }


  ngAfterViewInit(): void {

  }
  ngOnDestroy(): void {

  }

  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, 'mapel').subscribe(() => { });
  }

  private loadSelect2(): void {
    this.invItemService.getAllProduk().subscribe(x => {
      this.dataSelectProduk = [];
      x['data'].forEach(d => {
        this.dataSelectProduk.push({ "id": d.id, "text": d.nama });
      });
    });
    this.gbmOrganisasiService.getAllByType('MILL').subscribe(x => {
      this.dataSelectMill = [];
      x.forEach(d => {
        this.dataSelectMill.push({ "id": d.id, "text": d.nama });
      });
    });
    this.gbmCustomerService.getAll().subscribe(x => {
      this.dataSelectCustomer = [];
      x['data'].forEach(d => {
        this.dataSelectCustomer.push({ "id": d.id, "text": d.nama_customer });
      });
    });
    this.gbmSupplierrService.getAll().subscribe(x => {
      this.dataSelectTransportir = [];
      x['data'].forEach(d => {
        this.dataSelectTransportir.push({ "id": d.id, "text": d.nama_supplier });
      });
    });
    this.SlsKontrakService.getAll().subscribe(x => {
      this.dataSelectKontrak = [];
      console.log(x);
      let p = x['data'];
      p.forEach(d => {
        this.dataSelectKontrak.push({ "id": d.id, "text": d.no_spk + ' -- ' + d.customer });
      });
    });

    this.PengirimanDetailForm.controls['customer'].valueChanges.subscribe(x => {
      let customer_id = x.id;
      this.SlsKontrakService.getAll().subscribe(x => {
        this.dataSelectSpk = [];
        x['data'].forEach(d => {
          if (d.customer_id == customer_id) {
            this.dataSelectSpk.push({ "id": d.id, "text": d.no_spk + ' - ' + d.customer });
          }
        });
      });
    });



    this.dataSelectBulan = [
      { "id": "01", "text": "Januari" },
      { "id": "02", "text": "Februari" },
      { "id": "03", "text": "Maret" },
      { "id": "04", "text": "April" },
      { "id": "05", "text": "Mei" },
      { "id": "06", "text": "Juni" },
      { "id": "07", "text": "Juli" },
      { "id": "08", "text": "Agustus" },
      { "id": "09", "text": "September" },
      { "id": "10", "text": "Oktober" },
      { "id": "11", "text": "November" },
      { "id": "12", "text": "Desember" },
    ];

    this.dataSelectTahun = [

      { "id": "2022", "text": "2022" },
      { "id": "2023", "text": "2023" },
      { "id": "2024", "text": "2024" },
      { "id": "2025", "text": "2025" },

    ];

  }

  reportPengiriman() {
    this.isFormPengirimanSubmitted = true;
    if (this.PengirimanForm.invalid) {
      return;
    }
    let kontrak_id;
    if (isNullOrUndefined(this.PengirimanForm.get('kontrak')) != true) {
      if (isNullOrUndefined(this.PengirimanForm.get('kontrak').value)) {
        kontrak_id = null
      } else {
        kontrak_id = this.PengirimanForm.get('kontrak').value.id;
      }

    } else {
      kontrak_id = null
    }
    let format_laporan = this.PengirimanForm.controls['format_laporan'].value;
    // let customer_id = (this.PengirimanForm.controls['customer'].value != null) ? this.PengirimanForm.controls['customer'].value['id'] : null;
    let customer_id;
    if (isNullOrUndefined(this.PengirimanForm.get('customer').value) != true) {
      if (isNullOrUndefined(this.PengirimanForm.get('customer').value!.id)) {
        customer_id = null
      } else {
        customer_id = this.PengirimanForm.get('customer').value.id;
      }

    } else {
      customer_id = null
    }
    let transportir_id;
    if (isNullOrUndefined(this.PengirimanForm.get('transportir').value) != true) {
      if (isNullOrUndefined(this.PengirimanForm.get('transportir').value!.id)) {
        transportir_id = null
      } else {
        transportir_id = this.PengirimanForm.get('transportir').value.id;
      }

    } else {
      transportir_id = null
    }
    let data = {
      spk_id: kontrak_id,
      format_laporan: format_laporan,
      customer_id: customer_id,
      transportir_id:transportir_id,
      tgl_mulai: formatDate(this.PengirimanForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      tgl_akhir: formatDate(this.PengirimanForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      dibuat_oleh:this.PengirimanForm.get('dibuat_oleh').value,
      disetujui_oleh:this.PengirimanForm.get('disetujui_oleh').value
    };
    console.log(data);
    this.pksTimbanganKirimService.getLaporanKirimDetailCustomer(data).subscribe((res: any) => {
      //console.log(res);
      // var fileURL = URL.createObjectURL(res);
      // window.open(fileURL);
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'laporan_pengiriman_detail.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });

  }

  reportPengirimanDetail(tipe_laporan) {
    this.isFormPengirimanDetailSubmitted = true;
    if (this.PengirimanDetailForm.invalid) {
      return;
    }

    let mill_id = (this.PengirimanDetailForm.controls['mill'].value != null) ? this.PengirimanDetailForm.controls['mill'].value['id'] : null;
    let customer_id;
    if (isNullOrUndefined(this.PengirimanDetailForm.get('customer').value) != true) {
      if (isNullOrUndefined(this.PengirimanDetailForm.get('customer').value!.id)) {
        customer_id = null
      } else {
        customer_id = this.PengirimanDetailForm.get('customer').value.id;
      }
    } else {
      customer_id = null
    }

    let spk_id;
    if (isNullOrUndefined(this.PengirimanDetailForm.get('kontrak')) != true) {
      if (isNullOrUndefined(this.PengirimanDetailForm.get('kontrak').value!.id)) {
        spk_id = null
      } else {
        spk_id = this.PengirimanDetailForm.get('kontrak').value.id;
      }
    }

    let transportir_id;
    if (isNullOrUndefined(this.PengirimanDetailForm.get('transportir').value) != true) {
      if (isNullOrUndefined(this.PengirimanDetailForm.get('transportir').value!.id)) {
        transportir_id = null
      } else {
        transportir_id = this.PengirimanDetailForm.get('transportir').value.id;
      }
    } else {
      transportir_id = null
    }

    let produk_id;
    if (isNullOrUndefined(this.PengirimanDetailForm.get('produk_id').value) != true) {
      if (isNullOrUndefined(this.PengirimanDetailForm.get('produk_id').value!.id)) {
        produk_id = null
      } else {
        produk_id = this.PengirimanDetailForm.get('produk_id').value.id;
      }

    } else {
      produk_id = null
    }
    let format_laporan = this.PengirimanDetailForm.controls['format_laporan'].value;
    let data = {
      format_laporan: format_laporan,
      mill_id: mill_id,
      customer_id: customer_id,
      spk_id: spk_id,
      transportir_id:transportir_id,
      produk_id: produk_id,
      tgl_mulai: formatDate(this.PengirimanDetailForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      tgl_akhir: formatDate(this.PengirimanDetailForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };
    console.log(data);
    this.pksTimbanganKirimService.getLaporanKirimDetail(data).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'laporan_rekap_pengiriman.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });
  }



}
