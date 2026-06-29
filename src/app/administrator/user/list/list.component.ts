import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SERVER_API_URL, SERVER_PATH_URL } from 'src/app/app.constants';
import { AddComponent } from '../add/add.component';
import {  GantiPasswordComponent } from '../ganti-password/ganti-password.component';

import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EditComponent } from '../edit/edit.component';
import { ImportComponent } from '../import/import.component';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { UserService } from 'src/app/shared/services/user.service';
import { AccessComponent } from '../access/acces.component';
import PerfectScrollbar from 'perfect-scrollbar';
import { LocationComponent } from '../location/location.component';
import { PostingComponent } from '../posting/posting.component';
import { AfdelingComponent } from '../afdeling/afdeling.component';
import { KasbankComponent } from '../kasbank/kasbank.component';

declare var swal: any;
const MenuName = 'user';
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
  user = [];
  bsModalRef: BsModalRef;
  dbName;
  pathName;
  PATH_URL;
  status = '1';
  isChecked = false;
  checkedList: any;
  status_update: any = "1";
  accessButton: any;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private dashboardService: DashboardService,
    private userService: UserService) {
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
    for (var i = 0; i < this.user.length; i++) {
      this.user[i].isSelected = this.isChecked;
    }
    this.getCheckedItemList();

  }


  // Check All Checkbox Checked
  isAllSelected() {
    this.isChecked = this.user.every(function (item: any) {
      return item.isSelected == true;
    })
    this.getCheckedItemList();
  }
  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.user.length; i++) {
      if (this.user[i].isSelected)
        this.checkedList.push(this.user[i]['id']);
    }
    //  this.checkedList = JSON.stringify(this.checkedList);
    // console.log(this.checkedList);
  }
  ngOnInit() {
    this.authenticationService.getAccessButton(MenuName).subscribe((u) => {
      this.accessButton = u['data'];
      // console.log(this.accessButton);


    });
    this.loadDatatable();
    this.loadDataSummary();
  }
  loadDataSummary() {
    // this.dashboardService.getDataAdmin().subscribe(data => {
    //   this.jumuserPending = data['jml_user_pending'];
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
          'data':'foto',
          'sortable': false,

          'width': "7%",
        },
        {
          'data': 'user_full_name',
          // 'sortable': false,
          // 'width': "15%",
          //'target': [0]
        },
        {
          'data': 'user_name',
          // 'width': "10%",
          // 'target': [0]
        },
        {
          'data': 'email',
          // 'width': "10%",
          // 'target': [0]
        },
        {
          'data': 'employee_name',
          // 'width': "10%",
          // 'target': [0]
        },
        {
          'data': 'jabatan',
          // 'width': "10%",
          // 'target': [0]
        },
        {
          'data': 'lokasi_tugas',
          // 'width': "10%",
          // 'target': [0]
        },
        {
          'data': 'sub_bagian',
          // 'width': "10%",
          // 'target': [0]
        },
        {
          'data': 'button',
           'width': "25%",
          // 'target': [0]
        }
      ],

      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(this.apiUrl + '/user/list/' + this.status, dataTablesParameters, {})
          .subscribe(resp => {
            this.user = resp.data;


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
    this.status = status;
    this.rerender();

  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload(null, false);
      setTimeout(() => {
        //this.dtTrigger.next();

        if (this.user.length > 0) {
          $('.tfoot_dt').addClass('d-none');
        } else {
          $('.tfoot_dt').removeClass('d-none');
        }
      });
    });
    this.loadDataSummary();
  }

  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, 'user').subscribe(() => { });
  }
  add() {
    let modalConfig = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true,
      //size: 'lg',
      //class: "modal-lg ",

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
  import() {
    let modalConfig = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true,
      //size: 'lg',
      class: "modal-lg ",

    };
    this.bsModalRef = this.bsModalService.show(ImportComponent, modalConfig);
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
      that.userService.delete(id).subscribe(data => {
        swal({
          title: 'Info!',
          text: 'Data berhasil diHapus.',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        that.rerender();

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

  gantipassword(id: number) {
    let that = this;
    let user;
    this.userService.getById(id).subscribe(data => {
      user = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        // class: "modal-lg ",
        initialState: {
          user: user
        }
      };
      this.bsModalRef = this.bsModalService.show(GantiPasswordComponent, modalConfig);
      this.bsModalRef.content.event.subscribe(data => {

        // let t = $('#datatables').DataTable().ajax.reload();
        // t.draw();
        that.rerender();
      });


    }, error => {

    });
  }


  edit(id: number) {
    let that = this;
    let user;
    this.userService.getById(id).subscribe(data => {
      user = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        // class: "modal-lg ",
        initialState: {
          user: user
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
  access(id: number) {
    let that = this;
    let user;
    this.userService.getById(id).subscribe(data => {
      user = data['data'];
      // console.log(user);
      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        // class: "modal-lg ",
        initialState: {
          user: user
        }
      };
      this.bsModalRef = this.bsModalService.show(AccessComponent, modalConfig);
      this.bsModalRef.content.event.subscribe(data => {

        // let t = $('#datatables').DataTable().ajax.reload();
        // t.draw();
        that.rerender();
      });


    }, error => {

    });

  }
  location(id: number) {
    let that = this;
    let user;
    this.userService.getById(id).subscribe(data => {
      user = data['data'];
      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        // class: "modal-lg ",
        initialState: {
          user: user
        }
      };
      this.bsModalRef = this.bsModalService.show(LocationComponent, modalConfig);
      this.bsModalRef.content.event.subscribe(data => {

        // let t = $('#datatables').DataTable().ajax.reload();
        // t.draw();
        that.rerender();
      });


    }, error => {

    });

  }
  afdeling(id: number) {
    let that = this;
    let user;
    this.userService.getById(id).subscribe(data => {
      user = data['data'];
      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        // class: "modal-lg ",
        initialState: {
          user: user
        }
      };
      this.bsModalRef = this.bsModalService.show(AfdelingComponent, modalConfig);
      this.bsModalRef.content.event.subscribe(data => {

        // let t = $('#datatables').DataTable().ajax.reload();
        // t.draw();
        that.rerender();
      });


    }, error => {

    });

  }

  kasbank(id: number) {
    let that = this;
    let user;
    this.userService.getById(id).subscribe(data => {
      user = data['data'];
      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        // class: "modal-lg ",
        initialState: {
          user: user
        }
      };
      this.bsModalRef = this.bsModalService.show(KasbankComponent, modalConfig);
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
    let user;
    this.userService.getById(id).subscribe(data => {
      user = data['data'];
      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        // class: "modal-lg ",
        initialState: {
          user: user
        }
      };
      this.bsModalRef = this.bsModalService.show(PostingComponent, modalConfig);
      this.bsModalRef.content.event.subscribe(data => {

        // let t = $('#datatables').DataTable().ajax.reload();
        // t.draw();
        that.rerender();
      });


    }, error => {

    });

  }
  onChangeStatus() {
    // console.log(this.status_update);

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
      that.userService.updateStatus(that.status_update, that.checkedList).subscribe(data => {

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

  }

}
