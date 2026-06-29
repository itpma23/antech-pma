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

import PerfectScrollbar from 'perfect-scrollbar';
import { PksSoundingService } from 'src/app/shared/services/pks_sounding.service';

declare var swal: any;
const MenuName = 'pks_sounding';
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
  private apiUrl = SERVER_API_URL;
  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  exportAsConfig: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'mytable',
  };
  pksSounding = [];
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
    private pksSoundingService: PksSoundingService) {
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


  ngOnInit() {
    this.authenticationService.getAccessButton(MenuName).subscribe((u) => {
      this.accessButton = u['data'];
      console.log(this.accessButton);


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
      order: [[ 4, "desc" ]],
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
          'visible': false,
          'width': "10%",
        },
        {
          'data': 'mill',
        },
        {
          'data': 'tanki',
        },
        { 'data':'no_transaksi' },
        { 'data':'tanggal' },
        { 'data':'tinggi' },
        { 'data':'volume' },
        { 'data':'suhu' },
      ],

      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(this.apiUrl + '/PksSounding/list/' + this.status, dataTablesParameters, {})
          .subscribe(resp => {
            this.pksSounding = resp.data;


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

        if (this.pksSounding.length > 0) {
          $('.tfoot_dt').addClass('d-none');
        } else {
          $('.tfoot_dt').removeClass('d-none');
        }
      });
    });

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
      that.pksSoundingService.delete(id).subscribe(data => {
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
    let pksSounding;
    this.pksSoundingService.getById(id).subscribe(data => {
      pksSounding = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        // class: "modal-lg ",
        initialState: {
          pksSounding: pksSounding
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

  onChangeStatus() {
    console.log(this.status_update);

  }


}
