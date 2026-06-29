import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SERVER_API_URL,SERVER_PATH_URL } from 'src/app/app.constants';

import { AddComponent } from '../add/add.component';
import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EditComponent } from '../edit/edit.component';
import { PksLhpService } from 'src/app/shared/services/pks_lhp.service';
import { Router } from '@angular/router';

declare var swal: any;

export class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
declare var $: any;

// set menu
const MenuName='pks_lhp';

// component
@Component({
  moduleId: module.id,
  selector: 'list-cmp',
  templateUrl: 'list.component.html'
})


export class ListComponent implements OnInit {
  dtOptions: any;
  private apiUrl = SERVER_API_URL;
  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  exportAsConfig: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'mytable',
  };

  // set var lhp
  lhp = [];


  bsModalRef: BsModalRef;
  dbName;
  pathName;
  PATH_URL;
  accessButton: any;
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private bsModalService: BsModalService,
    private exportAsService: ExportAsService,
    private lhpService: PksLhpService,
    private router: Router,) {
      this.dbName= this.authenticationService.getUserDB();
      this.pathName= this.authenticationService.getUserPath();
      this.PATH_URL=SERVER_PATH_URL;
      // add next
  }

  // initialize
  ngOnInit() {
    this.authenticationService.getAccessButton(MenuName).subscribe((u)=>{
      this.accessButton= u['data'];
      // console.log(this.accessButton);
    });
    this.loadDatatable();
    console.log('init');
  }

  // create table from plugin datatable
  loadDatatable() {

    let that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      order: [[1, 'desc']],

      language: {
        search: "_INPUT_",
        searchPlaceholder: "Cari",
      },
      columns: [
        {
          'data': 'id',
          'visible': false,
          'width': "10%"
        },
        {
          'data': 'tanggal',
          'width': "20%",
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

      // get data from ajax
      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(this.apiUrl + '/pksLhp/list', dataTablesParameters, {})
          .subscribe(resp => {
            this.lhp = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      }
    };
  }

  // after view
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  // on destroy data
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  // get tipe
  getTipe(tipe){
    let nama=""
    if (tipe=="0"){
      nama="Kas";
    }else if (tipe=="1"){
      nama="Bank";
    }else if (tipe=="2"){
      nama="Piutang";
    }else if (tipe=="3"){
      nama="Hutang";
    }else if (tipe=="4"){
      nama="Modal";
    }else if (tipe=="5"){
      nama="Biaya";
    }else if (tipe=="6"){
      nama="Pendapatan";
    }
    return nama;
  }

  // render datatable thead, tbody
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload(null, false);
      setTimeout(() => {
        //this.dtTrigger.next();
        if (this.lhp.length > 0) {
          $('.tfoot_dt').addClass('d-none');
        } else {
          $('.tfoot_dt').removeClass('d-none');
        }
      });
    });
  }

  // export file
  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, 'lhp').subscribe(() => { });
  }


  // create data
  add() {
    let modalConfig = {
      animated: true,
      keyboard: true,
      backdrop: true,
      size: 'lg',
      class: "modal-lg ",
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.bsModalService.show(AddComponent,modalConfig);
    this.bsModalRef.content.event.subscribe(result => {
      if (result == 'OK') {
        this.rerender();
      }
    });
  }

  // delete data
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
      that.lhpService.delete(id).subscribe(data => {
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

  // edit data
  edit(id: number) {
    let that = this;
    let lhp;
    this.lhpService.getById(id).subscribe(data => {
      lhp = data['data'];
      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        size: 'lg',
        class: "modal-lg ",
        ignoreBackdropClick: true,
        initialState: {
          lhp: lhp
        }
      };
      this.bsModalRef = this.bsModalService.show(EditComponent, modalConfig);
      this.bsModalRef.content.event.subscribe(data => {
        that.rerender();
      });
    }, error => {
      // do something if getById error
    });
  }

  viewSlip(id) {
    var mediaType = 'application/pdf';
    this.lhpService.getPdfSlip(id).subscribe(
      (res) => {
        // console.log(res);
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
        // var blob = new Blob([res], { type: mediaType });
        // saveAs(blob, 'report.pdf');
      }
    );
  }

  // read data
  detail(id: number) {
    this.router.navigate(['lhp/detail', id.toString(),{previousUrl: this.router.url}]);

  }
}
