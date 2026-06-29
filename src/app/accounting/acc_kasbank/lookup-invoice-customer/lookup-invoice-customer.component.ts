import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SERVER_API_URL, SERVER_PATH_URL } from 'src/app/app.constants';

import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EditComponent } from '../edit/edit.component';
import { AccApInvoiceService } from 'src/app/shared/services/acc_ap_invoice.service';
import 'bootstrap-notify';
declare var swal: any;
declare var $: any;

export class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'lookup-invoice-cust-cmp',
  templateUrl: 'lookup-invoice-customer.component.html'
})

export class LookupInvoiceCustomerComponent implements OnInit {
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
  apInvoice = [];
  event: EventEmitter<any> = new EventEmitter();

  dbName;
  pathName;
  PATH_URL;
  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private accApInvoiceService: AccApInvoiceService,
    private bsModalRef: BsModalRef) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;

  }

  ngOnInit() {
    this.loadDatatable();
  }

  loadDatatable() {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,

      //responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Cari",


      },

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

        if (this.apInvoice.length > 0) {
          $('.tfoot_dt').addClass('d-none');
        } else {
          $('.tfoot_dt').removeClass('d-none');
        }
      });
    });
  }

  addItem(item) {
    this.event.emit(item);
    this.bsModalRef.hide();

    // let i = this.apInvoice.indexOf(item);

    // if (i != -1) {
    //   this.apInvoice.splice(i, 1);
    //   this.event.emit(item);

    // }
  }
  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, 'invoice').subscribe(() => { });
  }

  onClose() {
    this.bsModalRef.hide();

  }
  showNotification(from, align, message, color = 4) {
    var type = ['', 'info', 'success', 'warning', 'danger', 'rose', 'primary'];
    console.log(type[color]);
    //var color = Math.floor((Math.random() * 6) + 1);

    $.notify({
      icon: "notifications",
      message: message

    }, {
      type: type[color],
      timer: 3000,
      placement: {
        from: from,
        align: align
      }
    });
  }

}
