import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { formatDate } from '@angular/common';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import { Subject } from 'rxjs';
import { SERVER_API_URL, SERVER_PATH_URL } from 'src/app/app.constants';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvPemakaianBarangOnlineService } from 'src/app/shared/services/inv_pemakaian_barang_online.service';
import { InvPengeluaranBarangService } from 'src/app/shared/services/inv_pengeluaran_barang.service';
import { AddComponent } from '../add/add.component';
import { isNullOrUndefined } from 'util';
import { DetailComponent } from '../detail/detail.component';
import { ToastrService } from 'ngx-toastr';
declare var swal: any;

export class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
declare var $: any;
const MenuName = 'inv_pengeluaran_barang';


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
  invPengeluaranBarang = [];

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
    private invPengeluaranBarangService: InvPengeluaranBarangService,
    private toastr: ToastrService,
    private router: Router, private builder: FormBuilder, private gbmOrganisasiService: GbmOrganisasiService,) {

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
          'data': 'is_posting',
          'width': "8%",
        },

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
          'tgl_akhir': formatDate(this.parameterForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US')

        };

        /* End Parameter */
        dataTablesParameters['parameter'] = parameter;
        this.http
          .post<DataTablesResponse>(this.apiUrl + '/invPengeluaranBarang/list', dataTablesParameters, {})
          .subscribe(resp => {

            this.invPengeluaranBarang = resp.data;

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

        if (this.invPengeluaranBarang.length > 0) {
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
    this.invPengeluaranBarangService.getPdfSlip(id).subscribe(
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
    // this.bsModalRef = this.bsModalService.show(AddComponent, modalConfig);
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
      that.invPengeluaranBarangService.delete(id).subscribe(data => {

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

  detail(id: number) {
    let that = this;
    let invPengeluaranBarang;
    this.invPengeluaranBarangService.getById(id).subscribe(data => {
      invPengeluaranBarang = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        size: 'lg',
        class: "modal-lg ",
        initialState: {
          invPengeluaranBarang: invPengeluaranBarang
        }
      };
      this.bsModalRef = this.bsModalService.show(DetailComponent, modalConfig);
      this.bsModalRef.content.event.subscribe(data => {

        // let t = $('#datatables').DataTable().ajax.reload();
        // t.draw();
        that.rerender();
      });


    }, error => {

    });

  }


  send(id: number) {
    let that = this;
    let invPengeluaranBarang;
    this.invPengeluaranBarangService.getById(id).subscribe(data => {
      invPengeluaranBarang = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        size: 'lg',
        class: "modal-lg ",
        initialState: {
          invPengeluaranBarang: invPengeluaranBarang
        }
      };
      this.bsModalRef = this.bsModalService.show(AddComponent, modalConfig);
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
    let invPengeluaranBarang;
    this.invPengeluaranBarangService.getById(id).subscribe(data => {
      invPengeluaranBarang = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        size: 'lg',
        class: "modal-lg ",
        initialState: {
          invPengeluaranBarang: invPengeluaranBarang
        }
      };
      // this.bsModalRef = this.bsModalService.show(ApprovalComponent, modalConfig);
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
      that.invPengeluaranBarangService.reset(id, data).subscribe(data => {

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
    if (p.last_approve_position == '' && p.status == 'CREATED') {
      status = "Belum diajukan Approval";
    } else if (p.is_posting == 1 && p.idapprove == null) {
      status = 'Status Approve V1';
    } else if (p.is_posting == '0' && p.idapprove == null) {
      status = 'Belum Mengajukan Approve v2';
    }
    else if (p.status != 'RELEASE' && p.status != 'REJECTED' && p.status != 'CLOSED' && p.idapprove != null) {
      status = 'menunggu approval ' + p.last_approve_position;
    } else if (p.status == 'RELEASE' && p.is_posting == '0') {
      status = 'Barang Telah Disetujui untuk Dikeluarkan';
    } else if (p.status == 'RELEASE' && p.is_posting == '1') {
      status = 'Barang Telah Dikeluarkan';
    }
    else {
      status = p.status;
    }
    return status
  }



  statusApproval(id: number) {
    let that = this;
    let invPengeluaranBarang;
    this.invPengeluaranBarangService.getById(id).subscribe(data => {
      invPengeluaranBarang = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        size: 'lg',
        class: "modal-lg ",
        initialState: {
          invPengeluaranBarang: invPengeluaranBarang
        }
      };
      // this.bsModalRef = this.bsModalService.show(PbStatusApprovalComponent, modalConfig);




    }, error => {

    });

  }


}
