import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SERVER_API_URL, SERVER_PATH_URL } from 'src/app/app.constants';
import { AddComponent } from '../add/add.component';
import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EditComponent } from '../edit/edit.component';
import { AccKasbankService } from 'src/app/shared/services/acc_kasbank.service';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { UploadComponent } from '../upload/upload.component';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';

import { formatDate } from '@angular/common';
import { isNullOrUndefined } from 'util';
declare var swal: any;

export class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
declare var $: any;
const MenuName = 'acc_kasbank';
@Component({
  moduleId: module.id,
  selector: 'list-cmp',
  templateUrl: 'list.component.html',
  styleUrls: ['list.css'],
})

export class ListComponent implements OnInit {
  // dtOptions: DataTables.Settings = {};
  dtOptions: any;
  private apiUrl = SERVER_API_URL;
  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  exportAsConfig: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'mytable',
  };
  accKasbank = [];
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
  dataSelectLokasi: any;
  dataSelectAkun: any[];
  dataSelectStatus: any;
  dataSelectTipe: { id: string; text: string; }[];
  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private accKasbankService: AccKasbankService,
    private router: Router, private builder: FormBuilder,
    private AccAkunService: AccAkunService,
    private gbmOrganisasiService: GbmOrganisasiService,) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;

    let toDate: Date = new Date();
    let startdate = new Date(toDate.getFullYear(), 0, 1)// 1 Januari tahun sekarang
    this.parameterForm = this.builder.group({
      lokasi: new FormControl([]),
      status: new FormControl([]),
      tipe: new FormControl([]),
      akun: new FormControl([]),
      tanggal_mulai: new FormControl(new Date(2025, 0, 1), Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),

    });

  }

  ngOnInit() {
    this.loadDatatable();
    this.authenticationService.getAccessButton(MenuName).subscribe((u) => {
      this.accessButton = u['data'];
      console.log(this.accessButton);

    });
    this.loadSelect2()

  }
  showData() {
    console.log(this.parameterForm.value)
    this.rerender()

  }
  loadDatatable() {
    console.log('here')
    let that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 100,
      serverSide: true,
      processing: true,
      order: [[5, "desc"]],
      //responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Cari",


      },
      // order: [1, 'asc'],
      // dom: '<"html5buttons"B>ltfrtip',
      columns: [
        {
          'data': 'id',
          //'sortable': false,
          'visible': false,
          'width': "10%",
          //'target': [0]
        },

        {
          'data': 'lokasi',
          // 'width': "8%",
        },
        {
          'data': 'no_transaksi',
          // 'width': "10%",
        },
        {
          'data': 'nama_kasbank',
          // 'width': "10%",
        },
        {
          'data': 'no_referensi',
          // 'width': "10%",
        },
        {
          'data': 'tipe_jurnal',
          // 'width': "10%",
        },
        {
          'data': 'tanggal',
          // 'width': "10%",
        },
        {
          'data': 'nilai',
          // 'width': "10%",
        },
        {
          'data': 'keterangan',
          // 'width': "10%",
        },
        {
          'data': 'is_posting',
          // 'width': "15%",
        },
        {
          'data': 'users',
          // 'width': "15%",
        },


      ],

      ajax: (dataTablesParameters: any, callback) => {
        /* Parameter */
        let akun_id;
        if (isNullOrUndefined(this.parameterForm.get('akun').value) != true) {
          if (isNullOrUndefined(this.parameterForm.get('akun').value!.id)) {
            akun_id = null
          } else {
            akun_id = this.parameterForm.get('akun').value.id;
          }
        } else {
          akun_id = null
        }
        let lokasi_id;
        if (isNullOrUndefined(this.parameterForm.get('lokasi').value) != true) {
          if (isNullOrUndefined(this.parameterForm.get('lokasi').value!.id)) {
            lokasi_id = null
          } else {
            lokasi_id = this.parameterForm.get('lokasi').value.id;
          }
        } else {
          lokasi_id = null
        }
        let status_id;
        if (isNullOrUndefined(this.parameterForm.get('status').value) != true) {
          if (isNullOrUndefined(this.parameterForm.get('status').value!.id)) {
            status_id = null
          } else {
            status_id = this.parameterForm.get('status').value.id;
          }
        } else {
          status_id = null
        }
        let tipe_id;
        if (isNullOrUndefined(this.parameterForm.get('tipe').value) != true) {
          if (isNullOrUndefined(this.parameterForm.get('tipe').value!.id)) {
            tipe_id = null
          } else {
            tipe_id = this.parameterForm.get('tipe').value.id;
          }
        } else {
          tipe_id = null
        }
        let parameter = {
          'lokasi_id': lokasi_id,
          'akun_id': akun_id,
          'status_id': status_id,
          'tipe_id': tipe_id,
          'tgl_mulai': formatDate(this.parameterForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
          'tgl_akhir': formatDate(this.parameterForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
        };
        /* End Parameter */

        dataTablesParameters['parameter'] = parameter;
        console.log(parameter)

        this.http
          .post<DataTablesResponse>(this.apiUrl + '/accKasbank/list', dataTablesParameters, {})
          .subscribe(resp => {
            this.accKasbank = resp.data;
            // console.log(this.accKasbank)
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      }
    };
  }

  private loadSelect2(): void {
    this.dataSelectStatus = [
      { id: 'N', text: 'Belum Posting' },
      { id: 'Y', text: 'Sudah Posting' }
    ];
    this.dataSelectTipe = [
      { id: 'in', text: 'Penerimaan' },
      { id: 'out', text: 'Pengeluaran/Pembayaran' }
    ];
    this.gbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });

      });
      this.AccAkunService.getAllKasbankByAccess().subscribe(x => {
        this.dataSelectAkun = [];
        let a = x['data'];
        a.forEach(d => {
          this.dataSelectAkun.push({ "id": d.id, "text": d.nama + "(" + d.kode + ")" });
        });

      });
    });
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

        if (this.accKasbank.length > 0) {
          $('.tfoot_dt').addClass('d-none');
        } else {
          $('.tfoot_dt').removeClass('d-none');
        }
      });
    });
  }

  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, 'kasbank').subscribe(() => { });
  }
  add() {
    let modalConfig = {
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
        // let t= $('#datatables').DataTable().ajax.reload();
        // t.draw();
        this.rerender();
      }
    });
  }

  viewSlip(id) {
    var mediaType = 'application/pdf';
    this.accKasbankService.getPdfSlip(id).subscribe(
      (res) => {
        // // console.log(res);
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
        // var blob = new Blob([res], { type: mediaType });
        // saveAs(blob, 'report.pdf');
      }
    );
  }

    viewSlipLaporanKasBank(id) {
    var mediaType = 'application/pdf';
    this.accKasbankService.getPdfSlipKasBank(id).subscribe(
      (res) => {
        // // console.log(res);
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
        // var blob = new Blob([res], { type: mediaType });
        // saveAs(blob, 'report.pdf');
      }
    );
  }
  viewSlipttd(id) {
    var mediaType = 'application/pdf';
    this.accKasbankService.getPdfSlipttdV2(id).subscribe(
      (res) => {
        // // console.log(res);
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
        // var blob = new Blob([res], { type: mediaType });
        // saveAs(blob, 'report.pdf');
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
      that.accKasbankService.delete(id).subscribe(data => {

        that.rerender();
        swal({
          title: 'Deleted!',
          text: 'Data berhasil dihapus.',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })

      });


    });

  }

  edit(id: number) {
    let that = this;
    let accKasbank;
    this.accKasbankService.getById(id).subscribe(data => {
      accKasbank = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        size: 'lg',
        class: "modal-lg ",
        initialState: {
          accKasbank: accKasbank
        }
      };
      this.bsModalRef = this.bsModalService.show(EditComponent, modalConfig);
      this.bsModalRef.content.event.subscribe(data => {

        // let t = $('#datatables').DataTable().ajax.reload();
        // t.draw();
        that.rerender();
      });


    }, error => {

    });

  }
  posting(id: number) {
    let that = this;
    let data;
    swal({
      title: 'Yakin akan diposting?',
      text: "Data tidak bisa akan dapat diubah !",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Ya, posting data!',
      cancelButtonText: 'Batal',

      buttonsStyling: false
    }).then(function () {
      that.accKasbankService.posting(id, data).subscribe(data => {
        if (data['status'] == 'OK') {
          that.rerender();
          swal({
            title: 'Info!',
            text: 'Posting berhasil.',
            type: 'success',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          })
        } else {

          swal({
            title: 'Perhatian!',
            text:'Posting gagal:'+ data['data'],
            type: 'warning',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          })

        }

      });

    });

  }
  download(id) {
    this.accKasbankService.getById(id).subscribe(data => {
      // console.log(data);
      let filename = data['data']['file_info']['name']
      this.accKasbankService.download(id, filename);
    });
  }
  upload(id: number) {
    let that = this;
    let accKasbank;
    this.accKasbankService.getById(id).subscribe(data => {
      accKasbank = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        size: 'lg',
        // class: "modal-lg ",
        initialState: {
          accKasbank: accKasbank
        }
      };
      this.bsModalRef = this.bsModalService.show(UploadComponent, modalConfig);
      this.bsModalRef.content.event.subscribe(data => {

        // let t = $('#datatables').DataTable().ajax.reload();
        // t.draw();
        that.rerender();
      });
    }, error => {
    });
  }
        viewPdf(id){
        this.accKasbankService.getById(id).subscribe(data => {
      // console.log(data);
      let filename = data['data']['file_info']['name']
      this.accKasbankService.openFile(id, filename);
    });
  }
}
