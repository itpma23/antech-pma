import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SERVER_API_URL } from 'src/app/app.constants';
// import { AddNewPostComponent } from './components/add-new-post/add-new-post.component';
// import { DeletePostComponent } from './components/delete-post/delete-post.component';
import { AddComponent } from '../add/add.component';
import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EditComponent } from '../edit/edit.component';
import { PrcQuotationService } from 'src/app/shared/services/prc_quotation.service';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Router } from '@angular/router';
// import * as $ from "jquery";
// require('sweetalert2');
declare var swal: any;
// import { DatatablesResponse } from '../../../../../core/helpers/datatables-response.helper';
// declare interface DataTable {
//   headerRow: string[];
//   footerRow: string[];
//   dataRows: string[][];
// }
const MenuName = 'prc_quotation';
export class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

declare var $: any;
declare var swal: any;
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
  quotation = [];
  bsModalRef: BsModalRef;
pengajar;
accessButton: any;
  constructor(private http: HttpClient,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private authenticationService: AuthenticationService,
    private quotationService: PrcQuotationService, private router: Router) {


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
          'data': 'no_quotation',
          // 'width': "60%",
          // 'target': [0]
        },
        {
          'data': 'no_referensi',
          // 'width': "60%",
          // 'target': [0]
        },
        {
          'data': 'catatan',
          // 'width': "60%",
          // 'target': [0]
        },
        {
          'data': 'id',
           'width': "30%",
          // 'target': [0]
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
        // dataTablesParameters['is_admin']=this.pengajar['is_admin'];
        // dataTablesParameters['pengajar_id']=this.pengajar['uniqid'];
        this.http
          .post<DataTablesResponse>(this.apiUrl + '/prcQuotation/list', dataTablesParameters, {})
          .subscribe(resp => {
            this.quotation = resp.data;

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

        if (this.quotation.length > 0) {
          $('.tfoot_dt').addClass('d-none');
        } else {
          $('.tfoot_dt').removeClass('d-none');
        }
      });
    });
  }

  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, 'quotation').subscribe(() => { });
  }
  add() {
    let modalConfig = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true,
      //size: 'lg',
      //class: "modal-lg ",
      initialState: {
        //type: type,
      }

    };
    this.bsModalRef = this.bsModalService.show(AddComponent,modalConfig);
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
      that.quotationService.delete(id).subscribe(data => {
        swal({
          title: 'Info!',
          text: 'Delete berhasil',
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

  edit(id: number) {
    let that = this;
    let quotation;
    this.quotationService.getDetail(id).subscribe(data => {
      quotation = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        //class: "modal-lg ",
        initialState: {
          quotation: quotation,
        }
      };
      this.bsModalRef = this.bsModalService.show(EditComponent, modalConfig);
      this.bsModalRef.content.event.subscribe(data => {
        that.rerender();
      });


    }, error => {

    });

  }
  detail(id: number) {
    this.router.navigate(['prc/quotation/detail', id.toString(),{previousUrl: this.router.url}]);

  }
}
