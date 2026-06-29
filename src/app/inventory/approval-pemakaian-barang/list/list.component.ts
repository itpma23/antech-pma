import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SERVER_API_URL, SERVER_PATH_URL } from 'src/app/app.constants';
import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { InvPemakaianBarangOnlineService } from 'src/app/shared/services/inv_pemakaian_barang_online.service';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { formatDate } from '@angular/common';
import { isNullOrUndefined } from 'util';
import { InvApprovalSettingPb } from 'src/app/shared/models/inv_approval_setting.model';
import { InvApprovalSettingPbService } from 'src/app/shared/services/inv_approvall_setting_pb.service';
import { NotifCountService } from 'src/app/shared/services/notifCount.service';
import { ApprovalComponent } from '../approval/approval.component';
import { PbStatusApprovalComponent } from '../pb-status-approval/pb_status_approval.component';
import { ApprovaFinalComponent } from '../approval-final/approval.component';

declare var swal: any;

export class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
declare var $: any;
const MenuName = 'inv_pemakaian_barang';
@Component({
  moduleId: module.id,
  selector: 'list-cmp',
  templateUrl: 'list.component.html',
  styleUrls: ['list,component.css'],
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
  invPemakaianBarang = [];
  //public dataTable: DataTable;
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
  dataSelectStatus: { id: string; text: string; }[];
  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private invPemakaianBarangService: InvPemakaianBarangOnlineService,
    private invPemakaianBarangApprovalSettingService: InvApprovalSettingPbService,
    private router: Router, private builder: FormBuilder,
    private notifCountService: NotifCountService,
    private gbmOrganisasiService: GbmOrganisasiService,) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;

    let toDate: Date = new Date();
    let startdate = new Date(toDate.getFullYear(), 0, 1)// 1 Januari tahun sekarang
    this.parameterForm = this.builder.group({
      lokasi: new FormControl([]),
      status: new FormControl([]),
      tanggal_mulai: new FormControl(new Date(2025, 0, 1), Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),

    });

  }

  ngOnInit() {
    this.authenticationService.getAccessButton(MenuName).subscribe((u) => {
      this.accessButton = u['data'];
      // console.log(this.accessButton);


    });
    this.loadSelect2();
    this.loadDatatable();
  }
  showData() {
    console.log(this.parameterForm.value)
    this.rerender()

  }
  loadDatatable() {
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 100,
      serverSide: true,
      processing: true,
      responsive: true, // Aktifkan responsive
      dom: "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" + // 'l' = length menu, 'f' = search filter
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      order: [[5, 'desc']],
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Cari",
      },
      columns: [
        { title: 'ID', data: 'id', visible: false },
        { title: 'Lokasi', data: 'lokasi', responsivePriority: 3 },
        {
          title: 'Afd/Stasiun/Traksi',
          data: null,
          render: (data, type, row) => row.tipe === 'UNIT' ? row.lokasi_afd : row.lokasi_traksi,
          responsivePriority: 5
        },
        { title: 'Gudang', data: 'gudang', responsivePriority: 6 },
        { title: 'NoTransaksi', data: 'no_transaksi', responsivePriority: 1 }, // Paling penting
        { title: 'Tanggal', data: 'tanggal', responsivePriority: 4 },
        { title: 'Catatan', data: 'catatan', responsivePriority: 7 },
        {
          title: 'Status',
          data: null,
          render: (data, type, row) => that.getStatusPP(row),
          responsivePriority: 8
        },
        {
          title: '',
          data: null,
          orderable: false,
          searchable: false,
          render: (data, type, row) => {
            let buttons = '';
            buttons += `<a href="#" class="btn btn-simple btn-info btn-icon detail" data-id="${row.id}" title="Detail"><i class="material-icons">info</i></a> `;
            if (row.is_posting != 1) {
              buttons += `<a href="#" class="btn btn-simple btn-warning btn-icon approval" data-id="${row.id}" title="Approval"><i class="material-icons">person</i></a> `;
            }
            buttons += `<a href="#" class="btn btn-simple btn-warning btn-icon status" data-id="${row.id}" title="Status"><i class="material-icons">list</i></a> `;
            buttons += `<a href="#" class="btn btn-simple btn-warning btn-icon pdf" data-id="${row.id}" title="PDF"><i class="material-icons">picture_as_pdf</i></a>`;
            return buttons;
          },
          responsivePriority: 2 // Selalu tampil juga
        }
      ],
      ajax: (dataTablesParameters: any, callback) => {
        let lokasiControl = this.parameterForm.get('lokasi');
        let lokasiValue = lokasiControl ? lokasiControl.value : null;
        let lokasi_id = lokasiValue && lokasiValue.id ? lokasiValue.id : null;

        let statusControl = this.parameterForm.get('status');
        let statusValue = statusControl ? statusControl.value : null;
        let status_id = statusValue && statusValue.id ? statusValue.id : null;

        const parameter = {
          status_id,
          lokasi_id,
          tgl_mulai: formatDate(this.parameterForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
          tgl_akhir: formatDate(this.parameterForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
        };
        dataTablesParameters['parameter'] = parameter;

        this.http.post<DataTablesResponse>(this.apiUrl + '/InvPemakaianBarang/listByUserApprove', dataTablesParameters, {})
          .subscribe(resp => {
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: resp.data // Data untuk render baris tabel
            });
          });
      },
      drawCallback: () => {
        // Binding event tombol aksi
        $('#mytable').off('click', '.approval').on('click', '.approval', (e) => {
          e.preventDefault();
          const id = $(e.currentTarget).data('id');
          this.approval(id);
        });

        $('#mytable').off('click', '.status').on('click', '.status', (e) => {
          e.preventDefault();
          const id = $(e.currentTarget).data('id');
          this.statusApproval(id);
        });

        $('#mytable').off('click', '.detail').on('click', '.detail', (e) => {
          e.preventDefault();
          const id = $(e.currentTarget).data('id');
          this.statusApproval(id);
        });

        $('#mytable').off('click', '.pdf').on('click', '.pdf', (e) => {
          e.preventDefault();
          const id = $(e.currentTarget).data('id');
          this.viewSlip(id);
        });

      }
    };
  }


  private loadSelect2(): void {
    this.dataSelectStatus = [
      { id: 'N', text: 'Belum Posting' },
      { id: 'Y', text: 'Sudah Posting' }
    ];
    this.gbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });

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

        if (this.invPemakaianBarang.length > 0) {
          $('.tfoot_dt').addClass('d-none');
        } else {
          $('.tfoot_dt').removeClass('d-none');
        }
      });
    });
  }

  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, 'approval-pemakaian-barang').subscribe(() => { });
  }

  viewSlip(id) {
    var mediaType = 'application/pdf';
    this.invPemakaianBarangService.getPdfSlip(id).subscribe(
      (res) => {
        // // console.log(res);
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
        // var blob = new Blob([res], { type: mediaType });
        // saveAs(blob, 'report.pdf');
      }
    );
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
      that.invPemakaianBarangService.posting(id, data).subscribe(data => {

        that.rerender();
        if (data['status'] == 'OK') {
          swal({
            title: 'Info!',
            text: 'Posting berhasil.',
            type: 'success',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          })
        } else {
          console.log(data);
          let items = [];
          if (data['data']) {
            items = data['data'];
            let msg = '';
            if (Array.isArray(items)) {
              console.log(items);
              items.forEach(element => {
                msg = msg + element['kode'] + '-' + element['nama'] + ', Stok:' + element['stok'] + '\n';
              });
              swal({
                title: 'Info!',
                text: 'Ada Stok Minus.' + msg,
                type: 'warning',
                confirmButtonClass: "btn btn-success",
                buttonsStyling: false
              })
            } else {
              swal({
                title: 'Info!',
                text: 'Posting gagal:' + data['data'],
                type: 'warning',
                confirmButtonClass: "btn btn-success",
                buttonsStyling: false
              })


            }
          } else {
            swal({
              title: 'Info!',
              text: 'Posting gagal',
              type: 'warning',
              confirmButtonClass: "btn btn-success",
              buttonsStyling: false
            })

          }
          // if (data['message']) {
          //   swal({
          //     title: 'Info!',
          //     text: 'Posting gagal:' + data['message'],
          //     type: 'warning',
          //     confirmButtonClass: "btn btn-success",
          //     buttonsStyling: false
          //   })

          // }else{
          //   swal({
          //     title: 'Info!',
          //     text: 'Posting gagal:' + data['data'],
          //     type: 'warning',
          //     confirmButtonClass: "btn btn-success",
          //     buttonsStyling: false
          //   })

          // }

        }
      });

    });

  }

  getStatusPP(p) {
    let status = ""

    // Mapping jabatan
    const posisiMap = {
      'PB1': 'Asisten',
      'PB2': 'Kasie',
      'PB3': 'Manager',
      // Tambahkan lagi jika ada posisi lain
    };

    // Ambil jabatan berdasarkan posisi, jika tidak ditemukan pakai posisi aslinya
    const jabatan = posisiMap[p.last_approve_position] || p.last_approve_position;
    if (p.last_approve_position == '' && p.status == '') {
      status = "Belum diajukan Approval";
    }
    else if (p.status != 'RELEASE' && p.status != 'REJECTED' && p.status != 'CLOSED') {
      status = 'menunggu approval ' + jabatan;
    }
    else {
      status = p.status;
    }
    return status
  }

  statusApproval(id: number) {
    let that = this;
    let InvPemakaianBarang;
    this.invPemakaianBarangService.getById(id).subscribe(data => {
      InvPemakaianBarang = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        size: 'lg',
        class: "modal-lg ",
        initialState: {
          InvPemakaianBarang: InvPemakaianBarang
        }
      };
      this.bsModalRef = this.bsModalService.show(PbStatusApprovalComponent, modalConfig);




    }, error => {

    });

  }

  approval(id: number) {

    let that = this;
    let InvPemakaianBarang;
    this.invPemakaianBarangService.getById(id).subscribe(data => {
      InvPemakaianBarang = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        size: 'lg',
        class: "modal-lg ",
        initialState: {
          InvPemakaianBarang: InvPemakaianBarang
        }
      };
      // console.log(InvPemakaianBarang)
      this.invPemakaianBarangApprovalSettingService.getByLokasiKodeKaryawan(InvPemakaianBarang['lokasi_id'], InvPemakaianBarang['last_approve_position'], InvPemakaianBarang['last_approve_user']).subscribe(a => {

        if (a['data']['is_finish'] == 0) {
          this.bsModalRef = this.bsModalService.show(ApprovalComponent, modalConfig);

        } else {
          this.bsModalRef = this.bsModalService.show(ApprovaFinalComponent, modalConfig);
        }
        this.bsModalRef.content.event.subscribe(data => {
          this.notifCountService.sendMessage('change');
          that.rerender();
        });
      });



    }, error => {

    });

  }

}
