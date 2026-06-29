import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SERVER_API_URL, SERVER_PATH_URL } from 'src/app/app.constants';
// import { AddNewPostComponent } from './components/add-new-post/add-new-post.component';
// import { DeletePostComponent } from './components/delete-post/delete-post.component';
// import { AddComponent } from '../add/add.component';
import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EditComponent } from '../edit/edit.component';
import { PksTimbanganKirimService } from 'src/app/shared/services/pks_timbangan_kirim.service';
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
  selector: 'lookup-timbangan-kirim-cmp',
  templateUrl: 'lookup-timbangan-kirim.component.html'
})

export class LookupTimbanganKirimComponent implements OnInit {
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
  PksTimbanganKirim = [];
  event: EventEmitter<any> = new EventEmitter();

  dbName;
  pathName;
  PATH_URL;
  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private PksTimbanganKirimService: PksTimbanganKirimService,
    private bsModalRef: BsModalRef) {
      this.dbName= this.authenticationService.getUserDB();
      this.pathName= this.authenticationService.getUserPath();
      this.PATH_URL=SERVER_PATH_URL;

  }

  ngOnInit() {
    this.loadDatatable();
  }

  loadDatatable() {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Cari",
      },
      columns: [
        {
          'data': 'id',
          'visible': false,
          'width': "10%",
        },
        { 'data':'no_tiket' },
        { 'data':'no_referensi' },
        { 'data':'tanggal' },
        { 'data':'jam_masuk' },
        { 'data':'jam_keluar' },

      ],
      ajax: (dataTablesParameters: any, callback) => {
        this.http
        .post<DataTablesResponse>(this.apiUrl + '/PksTimbanganKirim/list', dataTablesParameters, {})
        .subscribe(resp => {
          console.log(resp.data);
          this.PksTimbanganKirim = resp.data;

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

        if (this.PksTimbanganKirim.length > 0) {
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

    // let i = this.PksTimbanganKirim.indexOf(item);

    // if (i != -1) {
    //   this.PksTimbanganKirim.splice(i, 1);
    //   this.event.emit(item);

    // }
  }
  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, 'PksTimbanganKirim').subscribe(() => { });
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
