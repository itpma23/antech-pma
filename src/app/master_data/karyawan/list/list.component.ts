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
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import PerfectScrollbar from 'perfect-scrollbar';
// import * as $ from "jquery";
// require('sweetalert2');
declare var swal: any;

export class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

//import * as $ from "jquery";
declare var $: any;
const MenuName='karyawan';
@Component({
  moduleId: module.id,
  selector: 'list-cmp',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.css']
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
  karyawan = [];
  //public dataTable: DataTable;

  bsModalRef: BsModalRef;
  dbName;
  pathName;
  PATH_URL;
  status_id = "1";
  jumSiswa = 0;
  jumSiswaPending = 0;
  jumkaryawan = 0;
  jumkaryawanPending = 0;
  isChecked = false;
  checkedList: any;
  status_update: any = "1";
  accessButton:any={};

  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private karyawanService: KaryawanService, private dashboardService: DashboardService,
    private router: Router,) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;
    const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
       const elemSidebar = <HTMLElement>document.querySelector('.sidebar-wrapper');
    setTimeout(() => {
      let ps = new PerfectScrollbar(elemMainPanel);
      ps.update();
        let ps2 = new PerfectScrollbar(elemSidebar);
      ps2.update();

  }, 1000);


  }
  checkuncheckall() {
    if (this.isChecked == true) {
      this.isChecked = false;
    }
    else {
      this.isChecked = true;
    }
    for (var i = 0; i < this.karyawan.length; i++) {
      this.karyawan[i].isSelected = this.isChecked;
    }
    this.getCheckedItemList();

  }


  // Check All Checkbox Checked
  isAllSelected() {
    this.isChecked = this.karyawan.every(function (item: any) {
      return item.isSelected == true;
    })
    this.getCheckedItemList();
  }
  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.karyawan.length; i++) {
      if (this.karyawan[i].isSelected)
        this.checkedList.push(this.karyawan[i]['id']);
    }
    //  this.checkedList = JSON.stringify(this.checkedList);
    console.log(this.checkedList);
  }

  ngOnInit() {

   this.authenticationService.getAccessButton(MenuName).subscribe((u)=>{
      this.accessButton= u['data'];
      // console.log(this.accessButton);


    });

    this.loadDatatable();
    // this.loadDataSummary();

  }
  loadDataSummary() {
    // this.dashboardService.getDataAdmin().subscribe(data => {
    //   this.jumSiswa = data['jml_siswa'];
    //   this.jumSiswaPending = data['jml_siswa_pending'];
    //   this.jumkaryawan = data['jml_karyawan'];
    //   this.jumkaryawanPending = data['jml_karyawan_pending'];

    // });

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
          'data': 'foto',
          'sortable': false,

          'width': "10%",
          //'target': [0]
        },
        {
          'data': 'lokasi',
          //'width': "10%",
          // 'target': [0]
        },
        {
          'data': 'nip',
          'width': "10%",
          // 'target': [0]
        },
        {
          'data': 'nama',
          'width': "15%",
          // 'target': [1]
        },

        {
          'data': 'departemen',
          'width': "15%",
          // 'target': [1]
        },
        {
          'data': 'jabatan',
          'width': "15%",
          // 'target': [1]
        },
        {
          'data': 'golongan',
          'width': "15%",
          // 'target': [1]
        },


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
          .post<DataTablesResponse>(this.apiUrl + '/karyawan/list/' + this.status_id, dataTablesParameters, {})
          .subscribe(resp => {
            this.karyawan = resp.data;

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
  changeStatus(status) {
    this.status_id = status;
    this.rerender();

  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload(null, false);
      setTimeout(() => {
        //this.dtTrigger.next();

        if (this.karyawan.length > 0) {
          $('.tfoot_dt').addClass('d-none');
        } else {
          $('.tfoot_dt').removeClass('d-none');
        }
      });
    });
    // this.loadDataSummary();
  }

  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, 'karyawan').subscribe(() => { });
  }
  add() {
    let modalConfig = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true,
      //size: 'lg',
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
      that.karyawanService.delete(id).subscribe(data => {
        // let t = $('#datatables').DataTable().ajax.reload();
        // t.draw();
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
    let karyawan;
    this.karyawanService.getById(id).subscribe(data => {
      karyawan = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        class: "modal-lg ",
        initialState: {
          karyawan: karyawan
        }
      };
      this.bsModalRef = this.bsModalService.show(EditComponent, modalConfig);
      this.bsModalRef.content.event.subscribe(result => {
        if (result == 'OK') {
          // let t= $('#datatables').DataTable().ajax.reload();
          // t.draw();
          this.rerender();
        }
      });


    }, error => {

    });

  }
  // detail(id: number) {
  //   this.router.navigate(['karyawan/detail', id.toString(), { previousUrl: this.router.url }]);

  // }
  detailPdf(id) {
    var mediaType = 'application/pdf';
    this.karyawanService.getDetailPdf(id).subscribe(
      (res) => {
        // console.log(res);
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
        // var blob = new Blob([res], { type: mediaType });
        // saveAs(blob, 'report.pdf');
      }
    );
  }
  updateStatus() {
    let that = this;
    swal({
      title: 'Yakin akan mengupdate Status?',
      text: "Update Status!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Ya!',
      cancelButtonText: 'Batal',

      buttonsStyling: false
    }).then(function () {
      that.karyawanService.updateStatus(that.status_update, that.checkedList).subscribe(data => {

        that.rerender();
        swal({
          title: 'Sukses!',
          text: 'Update berhasil.',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })

      });


    });

  } onChangeStatus() {
    console.log(this.status_update);

  }  
}
