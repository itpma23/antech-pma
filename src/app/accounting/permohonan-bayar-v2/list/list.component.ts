import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SERVER_API_URL, SERVER_PATH_URL } from '../../../app.constants';
import { AddComponent } from '../add/add.component';
import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EditComponent } from '../edit/edit.component';
import { AccPermohonanBayarService } from '../../../shared/services/acc_permohonan_bayar.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccPermohonanBayarV2Service } from 'src/app/shared/services/acc_permohonan_bayar_v2.service';
import { AccKasbankService } from 'src/app/shared/services/acc_kasbank.service';

declare var swal: any;
declare var $: any;

export class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

const MenuName = 'acc_permohonan_bayar_v2';

@Component({
  moduleId: module.id,
  selector: 'list-cmp',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.css'],
})
export class ListComponent implements OnInit {
  dtOptions: any;
  private apiUrl = SERVER_API_URL;
  @ViewChild(DataTableDirective, { static: true }) dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  exportAsConfig: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'mytable',
  };

  accPermohonanBayar: any = [];
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }

  bsModalRef: BsModalRef;
  dbName;
  pathName;
  PATH_URL;
  accessButton: any;
  parameterForm: any;

  // Tambahan untuk modal approve
  approveForm: FormGroup;
  selectedSlipId: number | null = null;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private bsModalService: BsModalService,
    private exportAsService: ExportAsService,
    private accKasbankService: AccKasbankService,

    private accPermohonanBayarService: AccPermohonanBayarService,
    private accPermohonanBayarV2Service: AccPermohonanBayarV2Service,
    private router: Router,
    private builder: FormBuilder
  ) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;

    let toDate: Date = new Date();
    this.parameterForm = this.builder.group({
      tanggal_mulai: new FormControl(new Date(2026, 0, 1), Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      status_bayar: new FormControl('') // default = semua

    });

    // === Form Approve Modal ===
    this.approveForm = this.builder.group({
      approve_name_1: ['', Validators.required],
      approve_name_2: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadDatatable();
    this.authenticationService.getAccessButton(MenuName).subscribe((u) => {
      this.accessButton = u['data'];
    });
  }

  showData() {
    this.rerender();
  }

  loadDatatable() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Cari",
      },
      columns: [
        { data: 'id', visible: false, width: "10%" },
        { data: 'no_transaksi', width: "8%" },
        { data: 'no_referensi', width: "10%" },
        { data: 'tanggal', width: "10%" },
        { data: 'supplier', width: "10%" },
        // { data: 'diminta_oleh', width: "10%" },
        { data: 'divisi', width: "10%" },
        { data: 'total', width: "10%" },
        { data: 'ket', width: "10%" },
        { data: 'status_bayar', width: "10%" },
      ],
      ajax: (dataTablesParameters: any, callback) => {
        let parameter = {
          tgl_mulai: formatDate(this.parameterForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
          tgl_akhir: formatDate(this.parameterForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
          status_bayar: this.parameterForm.controls['status_bayar'].value

        };

        dataTablesParameters['parameter'] = parameter;

        this.http
          .post<DataTablesResponse>(this.apiUrl + '/AccPermohonanBayarV2/list', dataTablesParameters, {})
          .subscribe(resp => {
            this.accPermohonanBayar = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      }
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload(null, false);
      setTimeout(() => {
        //this.dtTrigger.next();
        if (this.accPermohonanBayar.length > 0) {
          $('.tfoot_dt').addClass('d-none');
        } else {
          $('.tfoot_dt').removeClass('d-none');
        }
      });
    });
  }

  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, 'rpt').subscribe(() => { });
  }

  add() {
    const modalConfig = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true,
      size: 'lg',
      class: "modal-lg ",
    };
    this.bsModalRef = this.bsModalService.show(AddComponent, modalConfig);
    this.bsModalRef.content.event.subscribe(result => {
      if (result == 'OK') {
        this.rerender();
      }
    });
  }

  /** =============================
   * VIEW SLIP DENGAN KONFIRMASI
   * ============================= */
  viewSlip(id: number) {
    this.selectedSlipId = id;

    // 🔎 Cek dulu data dari backend apakah approve_name_1 dan 2 sudah terisi
    this.accPermohonanBayarV2Service.getById(id).subscribe((resp) => {
      const data = resp['data'];

      // Jika dua field approve sudah ada → langsung buka PDF
      if (
        data &&
        data['approve_name_1'] != null && data['approve_name_1'] != '' &&
        data['approve_name_2'] != null && data['approve_name_2'] != ''
      ) {
        console.log('Langsung tampilkan PDF, sudah di-approve:', data);


        this.accPermohonanBayarV2Service.getPdfSlip(id).subscribe((res) => {
          swal.close();
          const fileURL = URL.createObjectURL(res);
          window.open(fileURL);
        });

        return; // Stop di sini, tidak tampil modal
      }

      // Kalau belum ada approve name, tampilkan modal
      this.approveForm.reset();
      this.approveForm.patchValue({
        approve_name_1: 'M. Feizal Deradjat',
        approve_name_2: 'Mulyanto / Kurniawan'
      });

      ($('#approveModal') as any).modal('show');
    });
  }


  confirmViewSlip() {
    if (this.approveForm.invalid) {
      swal({
        title: 'Lengkapi data!',
        text: 'Mohon isi nama Diketahui oleh dan Disetujui oleh.',
        type: 'warning',
        confirmButtonClass: "btn btn-warning",
        buttonsStyling: false
      });
      return;
    }

    const approveData = this.approveForm.value;
    console.log('approve data =>', approveData);
    ($('#approveModal') as any).modal('hide');

    // 🔄 Tampilkan loading spinner tanpa teks


    // 🚀 Jalankan updateApprove
    this.accPermohonanBayarV2Service.updateApprove(this.selectedSlipId, approveData)
      .subscribe(
        () => {
          // ✅ Tutup spinner
          swal.close();

          // Langsung buka PDF setelah update selesai
          this.accPermohonanBayarV2Service.getPdfSlip(this.selectedSlipId).subscribe((res) => {
            const fileURL = URL.createObjectURL(res);
            window.open(fileURL);
          });
        },
        () => {
          swal.close();
          swal({
            title: 'Gagal Update!',
            text: 'Data tidak dapat diperbarui sebelum menampilkan PDF.',
            type: 'error',
            confirmButtonClass: "btn btn-danger",
            buttonsStyling: false
          });
        }
      );
  }






  delete(id: number) {
    let that = this;
    swal({
      title: 'Yakin akan menghapus?',
      text: "Data akan dihapus dari database!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Ya, hapus data!',
      cancelButtonText: 'Batal',
      buttonsStyling: false
    }).then(function () {
      that.accPermohonanBayarV2Service.delete(id).subscribe(data => {
        that.rerender();
        swal({
          title: 'Deleted!',
          text: 'Data berhasil dihapus.',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        });
      });
    });
  }

  edit(id: number) {
    let that = this;
    let accPermohonanBayar;
    this.accPermohonanBayarV2Service.getById(id).subscribe(data => {
      accPermohonanBayar = data['data'];
      const modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        size: 'lg',
        class: "modal-lg ",
        initialState: { accPermohonanBayar: accPermohonanBayar }
      };
      this.bsModalRef = this.bsModalService.show(EditComponent, modalConfig);
      this.bsModalRef.content.event.subscribe(data => {
        that.rerender();
      });
    });
  }

  posting(id: number) {
    let that = this;
    let data;
    swal({
      title: 'Yakin akan diposting?',
      text: "Data tidak akan dapat diubah!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Ya, posting data!',
      cancelButtonText: 'Batal',
      buttonsStyling: false
    }).then(function () {
      that.accPermohonanBayarV2Service.posting(id, data).subscribe(data => {
        that.rerender();
        swal({
          title: 'Info!',
          text: 'Posting berhasil.',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        });
      });
    });
  }

  previewBukti(id: number) {
  this.accKasbankService.getById(id).subscribe(
    (resp) => {

      const data = resp && resp['data'] ? resp['data'] : null;

      const fileInfo   = data && data['file_info'] ? data['file_info'] : null;
      const uploadFile = data && data['upload_file'] ? data['upload_file'] : null;
      const noTransaksi = data && data['no_transaksi'] ? data['no_transaksi'] : '-';

      // 🔒 VALIDASI
      if (
        !data ||
        !uploadFile ||
        !fileInfo ||
        !fileInfo['name'] ||
        fileInfo['name'] === 'files' ||
        fileInfo['mime'] === false
      ) {
        swal({
          title: 'Bukti belum tersedia',
          text: 'Bukti pembayaran untuk no kas bank\n\n' 
                + noTransaksi + '\n\nbelum diupload di modul kas bank.',
          type: 'info',
          confirmButtonClass: "btn btn-primary",
          buttonsStyling: false
        });
        return;
      }

      const filename = fileInfo['name'];

      // ✅ buka file
      this.accKasbankService.openFile(id, filename);
    },

    function () {
      swal({
        title: 'Gagal mengambil data',
        text: 'Terjadi kesalahan saat mengambil data kas bank.',
        type: 'error',
        confirmButtonClass: "btn btn-danger",
        buttonsStyling: false
      });
    }
  );
}
}
