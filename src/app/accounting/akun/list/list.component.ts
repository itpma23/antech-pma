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
import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
import { Router } from '@angular/router';

declare var swal: any;
const MenuName = 'acc_akun';
export class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'list-cmp',
  templateUrl: 'list.component.html'
})

export class ListComponent implements OnInit {
  // dtOptions: DataTables.Settings = {};
  dtOptions: any;
  persons: any[];
  private apiUrl = SERVER_API_URL;
  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  exportAsConfig: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'mytable',
  };
  akun = [];
  //public dataTable: DataTable;

  bsModalRef: BsModalRef;
  dbName;
  pathName;
  PATH_URL;
  accessButton: any;
  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private akunService: AccAkunService,
    private router: Router,) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;

  }

  ngOnInit() {
    this.authenticationService.getAccessButton(MenuName).subscribe((u) => {
      this.accessButton = u['data'];
    });
    this.loadDatatable();
  }

  loadDatatable() {

    let that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
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
          'data': 'kode',
        },
        {
          'data': 'nama',
        },
        {
          'data': 'tipe',
        },
        {
          'data': 'is_transaksi_akun',
        },
        {
          'data': 'is_kasbank_akun',
        },
        {
          'data': 'aktif',
        },
        {
          'data': 'users',
          'width': "15%"
        }
        
      ],
      // buttons: [
      //   {
      //     extend: 'csv',
      //     title: "csv",
      //     className: "btn btn-datatable-gredient",
      //     action: function (e, dt, node, config) {
      //       that.exportFiles('csv')
      //     }
      //   }, {
      //     extend: 'excel',
      //     title:"excel",
      //     className: "btn btn-datatable-gredient",
      //     action: function (e, dt, node, config) {
      //       that.exportFiles('xlsx')
      //     }
      //   }, {
      //     extend: 'pdf',
      //     title: "pdf",
      //     className: "btn btn-datatable-gredient",
      //     action: function (e, dt, node, config) {
      //       that.exportFiles('pdf')
      //     }
      //   }
      // ],
      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(this.apiUrl + '/accAkun/list', dataTablesParameters, {})
          .subscribe(resp => {
            this.akun = resp.data;

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
  getTipe(tipe) {

    let nama = ""
    if (tipe == "1") {
      nama = "AKTIVA (ASET)";

    } else if (tipe == "2") {
      nama = "KEWAJIBAN (LIABILITIES)";

    } else if (tipe == "3") {
      nama = "MODAL(EKUITAS)";

    } else if (tipe == "4") {
      nama = "TRANSIT";

    } else if (tipe == "5") {
      nama = "TRANSIT LAIN";

    } else if (tipe == "6") {
      nama = "BIAYA";

    } else if (tipe == "7") {
      nama = "BIAYA LAIN - LAIN";


    } else if (tipe == "8") {
      nama = "PENDAPATAN LAIN";


    } else if (tipe == "9") {
      nama = "PENDAPATAN";

    }
    return nama;
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload(null, false);
      setTimeout(() => {
        //this.dtTrigger.next();

        if (this.akun.length > 0) {
          $('.tfoot_dt').addClass('d-none');
        } else {
          $('.tfoot_dt').removeClass('d-none');
        }
      });
    });
  }

  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, 'akun').subscribe(() => { });
  }
  add() {
    let modalConfig = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true,
      //size: 'lg',
      // class: "modal-lg ",

    };
    this.bsModalRef = this.bsModalService.show(AddComponent, modalConfig);
    this.bsModalRef.content.event.subscribe(result => {
      if (result == 'OK') {
          swal({
            title: 'Info!',
            text: 'Data berhasil disimpan.',
            type: 'success',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          });

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
      that.akunService.delete(id).subscribe(data => {
        // let t = $('#datatables').DataTable().ajax.reload();
        // t.draw();
        that.rerender();
        swal({
          title: 'Deleted!',
          text: 'Data berhasil dihapus.',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        });
        this.event.emit('OK');
        this.bsModalRef.hide();
      });

      // swal({
      //   title: 'Deleted!',
      //   text: 'Your file has been deleted.',
      //   type: 'success',
      //   confirmButtonClass: "btn btn-success",
      //   buttonsStyling: false
      //   })
    });

  }

  edit(id: number) {
    let that = this;
    let akun;
    this.akunService.getById(id).subscribe(data => {
      akun = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        //class: "modal-lg ",
        initialState: {
          akun: akun
        }
      };
      this.bsModalRef = this.bsModalService.show(EditComponent, modalConfig);
      this.bsModalRef.content.event.subscribe(data => {
        if (data == 'OK') {
          swal({
            title: 'Info!',
            text: 'Data berhasil disimpan.',
            type: 'success',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          });
        }
        that.rerender();
      });


    }, error => {

    });

  }
  detail(id: number) {
    this.router.navigate(['akun/detail', id.toString(), { previousUrl: this.router.url }]);

  }

  exportAll() {
    var mediaType = 'application/pdf';
    this.akunService.getPdfExportAll().subscribe(
      (res) => {
        // // console.log(res);
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
        // var blob = new Blob([res], { type: mediaType });
        // saveAs(blob, 'report.pdf');
      }
    );
  }

}
