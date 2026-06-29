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
import { InvPemakaianBarangOnlineService } from 'src/app/shared/services/inv_pemakaian_barang_online.service';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { formatDate } from '@angular/common';
import { isNullOrUndefined } from 'util';
import { ApprovalComponent } from '../approval/approval.component';
import { PbStatusApprovalComponent } from '../pb-status-approval/pb_status_approval.component';

declare var swal: any;

export class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
declare var $: any;
const MenuName = 'inv_pemakaian_barang_online';
@Component({
  moduleId: module.id,
  selector: 'list-cmp',
  templateUrl: 'list.component.html'
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
    private router: Router, private builder: FormBuilder,
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
      tampilkanData: new FormControl('0',)

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

    let that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 100,
      serverSide: true,
      processing: true,
      //responsive: true,
      order: [[5, 'desc']],
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
          'width': "8%",
        },
        {
          'data': 'lokasi_afd',
          'width': "8%",
        },
        {
          'data': 'gudang',
          'width': "7%",
        },
        {
          'data': 'no_transaksi',
          'width': "12%",
        },
        {
          'data': 'tanggal',
          'width': "10%",
        },
        {
          'data': 'tipe',
          'width': "6%",
        },
        {
          'data': 'is_posting',
          'width': "8%",
        },

        {
          'data': 'dibuat',
          'width': "20%",
        }



      ],

      ajax: (dataTablesParameters: any, callback) => {
        /* Parameter */
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
        let parameter = {
          'status_id': status_id,
          'lokasi_id': lokasi_id,
          'tgl_mulai': formatDate(this.parameterForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
          'tgl_akhir': formatDate(this.parameterForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
          'tampilkanData': this.parameterForm.controls['tampilkanData'].value,
        };

        /* End Parameter */
        dataTablesParameters['parameter'] = parameter;
        this.http
          .post<DataTablesResponse>(this.apiUrl + '/InvPemakaianBarangOnline/list', dataTablesParameters, {})
          .subscribe(resp => {

            this.invPemakaianBarang = resp.data;

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
    this.exportAsService.save(this.exportAsConfig, 'kasbank').subscribe(() => { });
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
      that.invPemakaianBarangService.delete(id).subscribe(data => {

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
    let invPemakaianBarang;
    this.invPemakaianBarangService.getById(id).subscribe(data => {
      invPemakaianBarang = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        size: 'lg',
        class: "modal-lg ",
        initialState: {
          invPemakaianBarang: invPemakaianBarang
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


  approve(id: number) {
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
      this.bsModalRef = this.bsModalService.show(ApprovalComponent, modalConfig);
      this.bsModalRef.content.event.subscribe(data => {

        // let t = $('#datatables').DataTable().ajax.reload();
        // t.draw();
        that.rerender();
      });


    }, error => {

    });

  }

  revisi(id: number) {

  }

  reset(id: number) {
    let that = this;
    let data;
    swal({
      title: 'Yakin akan diperbarui?',
      text: "Silahkan melakukan perbarui data terlebih dahulu untuk dapat melakukan approve v2!. Data tidak akan hilang",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Ya, perbarui data!',
      cancelButtonText: 'Batal',

      buttonsStyling: false
    }).then(function () {
      that.invPemakaianBarangService.reset(id, data).subscribe(data => {

        that.rerender();
        if (data['status'] == 'OK') {
          swal({
            title: 'Info!',
            text: 'Perbarui Data berhasil.',
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


    if (p.last_approve_position == '' && p.status == 'CREATED') {
      status = "Belum diajukan Approval";
    } else if (p.is_posting == 1 && p.idapprove == null) {
      status = 'Status Approve V1';
    } else if (p.is_posting == '0' && p.idapprove == null) {
      status = 'Belum Mengajukan Approve v2';
    }
    else if (p.status != 'RELEASE' && p.status != 'REJECTED' && p.status != 'CLOSED' && p.idapprove != null) {
      status = 'Menunggu Approval ' + jabatan;
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


}
