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
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';

import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { PrcPpService } from 'src/app/shared/services/prc_pp.service';
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
  isFormPpDetailSubmitted = false;
  isFormAbsensiSubmitted = false;
  isFormLemburSubmitted = false;
  isFormPpSubmitted = false;
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

  PpForm: FormGroup;
  PpDetailForm: FormGroup;


  event: EventEmitter<any> = new EventEmitter();
  @ViewChild(DataTableDirective, { static: false })


  dataSelectPp;
  dataSelectLokasi;
  dataSelectBulan;
  dataSelectTahun;
  dataSelectKontrak;


  bsModalRef: BsModalRef;
  dataSelectPeriode: any[];
  dataSelectitem: any[];
  dataSelectStatusPP: { id: string; text: string; }[];

  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,


    private translate: TranslateService,

    private prcPpService: PrcPpService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private invItemService: InvItemService,


    private builder: FormBuilder) {
    let toDate: Date = new Date();



    this.PpForm = this.builder.group({
      // no_pp: new FormControl([], Validators.required),
      // kontrak: new FormControl([],),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),
    });
    this.PpDetailForm = this.builder.group({
      no_pp: new FormControl([],),
      item_id: new FormControl([],),
      status_pp: new FormControl([],),
      lokasi: new FormControl([]),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),

    });



  }

  ngOnInit() {
    this.loadSelect2();

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
    this.dataSelectStatusPP = [
      { id: 'CREATED', text: 'CREATED' },
      { id: 'PROSES_APPROVE', text: 'PROSES PERSETUJUAN' },
      { id: 'READY_PO', text: 'READY_PO (Semua)' },
      { id: 'READY_PO_WITHOUT', text: 'READY_PO (Belum dibuat PO)' },
      { id: 'REJECTED', text: 'REJECTED' },
      { id: 'CLOSED', text: 'CLOSED' },
    ];

    this.invItemService.getAll().subscribe(x => {
      this.dataSelectitem = [];
      x['data'].forEach(d => {
        this.dataSelectitem.push({ "id": d.id, "text": d.nama +"("+d.kode +")"});
      });
    });
    this.gbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
    });
    this.prcPpService.getAll().subscribe(x => {
      this.dataSelectPp = [];
      x['data'].forEach(d => {
        this.dataSelectPp.push({ "id": d.id, "text": d.no_pp  +"("+d.tanggal +")" });
      });
    });
    // this.SlsKontrakService.getAll().subscribe(x => {
    //   this.dataSelectKontrak = [];
    //   console.log(x);
    //   let p = x['data'];
    //   p.forEach(d => {
    //     this.dataSelectKontrak.push({ "id": d.id, "text": d.no_spk + ' -- ' + d.customer });
    //   });
    // });


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

  reportPp() {
    this.isFormPpSubmitted = true;
    if (this.PpForm.invalid) {
      return;
    }
    let kontrak_id;
    if (isNullOrUndefined(this.PpForm.get('kontrak')) != true) {
      if (isNullOrUndefined(this.PpForm.get('kontrak').value)) {
        kontrak_id = null
      } else {
        kontrak_id = this.PpForm.get('kontrak').value.id;
      }

    } else {
      kontrak_id = null
    }
    let pp_id = (this.PpForm.controls['no_pp'].value != null) ? this.PpForm.controls['no_pp'].value['id'] : null;
    let format_laporan=this.PpForm.controls['format_laporan'].value;
    let data = {
      format_laporan: format_laporan,
      spk_id: kontrak_id,
      pp_id: pp_id,
      tgl_mulai: formatDate(this.PpForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      tgl_akhir: formatDate(this.PpForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };
    console.log(data);
    this.prcPpService.getPPReportStatus(data).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'rincian_pp.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });

  }

  reportPpStatus(tipe_laporan) {
    this.isFormPpDetailSubmitted = true;
    if (this.PpDetailForm.invalid) {
      return;
    }

  //  let lokasi_id = (this.PpDetailForm.controls['lokasi'].value != null) ? this.PpDetailForm.controls['lokasi'].value['id'] : null;
    let lokasi_id;
    if (isNullOrUndefined(this.PpDetailForm.get('lokasi').value) != true) {
      if (isNullOrUndefined(this.PpDetailForm.get('lokasi').value!.id)) {
        lokasi_id = null
      } else {
        lokasi_id = this.PpDetailForm.get('lokasi').value.id;
      }

    } else {
      lokasi_id = null
    }
    let status_pp_id;
    if (isNullOrUndefined(this.PpDetailForm.get('status_pp').value) != true) {
      if (isNullOrUndefined(this.PpDetailForm.get('status_pp').value!.id)) {
        status_pp_id = null
      } else {
        status_pp_id = this.PpDetailForm.get('status_pp').value.id;
      }

    } else {
      status_pp_id = null
    }
    let pp_id;
    if (isNullOrUndefined(this.PpDetailForm.get('no_pp').value) != true) {
      if (isNullOrUndefined(this.PpDetailForm.get('no_pp').value!.id)) {
        pp_id = null
      } else {
        pp_id = this.PpDetailForm.get('no_pp').value.id;
      }

    } else {
      pp_id = null
    }
    let item_id;
    if (isNullOrUndefined(this.PpDetailForm.get('item_id').value) != true) {
      if (isNullOrUndefined(this.PpDetailForm.get('item_id').value!.id)) {
        item_id = null
      } else {
        item_id = this.PpDetailForm.get('item_id').value.id;
      }

    } else {
      item_id = null
    }
    let format_laporan=this.PpDetailForm.controls['format_laporan'].value;
    let data = {
      format_laporan: format_laporan,
      lokasi_id: lokasi_id,
      pp_id: pp_id,
      status_pp_id: status_pp_id,
      item_id: item_id,
      tgl_mulai: formatDate(this.PpDetailForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      tgl_akhir: formatDate(this.PpDetailForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };
    console.log(data);
    this.prcPpService.getPPReportStatus(data).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'rincian_pp.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });
  }



}
