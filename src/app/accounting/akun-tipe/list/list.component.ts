import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SERVER_API_URL, SERVER_PATH_URL } from 'src/app/app.constants';
import { AddComponent } from '../add/add.component';
import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EditComponent } from '../edit/edit.component';
import { Router } from '@angular/router';

declare var swal: any;
const MenuName = 'acc_akun_tipe';

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

  dtOptions: any;
  private apiUrl = SERVER_API_URL;

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject();

  exportAsConfig: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'mytable',
  };

  akunTipe = [];

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
    private router: Router,
  ) {

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

      language: {
        search: "_INPUT_",
        searchPlaceholder: "Cari",
      },

      columns: [

        {
          data: 'id',
          visible: false
        },

        {
          data: 'tipe_id'
        },

        {
          data: 'nama'
        },

        {
          data: 'dibuat'
        },

        {
          data: 'dibuat_tanggal'
        },

        {
          data: 'diubah'
        },

        {
          data: 'diubah_tanggal'
        }

      ],

      ajax: (dataTablesParameters: any, callback) => {

        this.http
          .post<DataTablesResponse>(this.apiUrl + '/accAkunTipe/list', dataTablesParameters, {})
          .subscribe(resp => {

            this.akunTipe = resp.data;

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

        if (this.akunTipe.length > 0) {
          $('.tfoot_dt').addClass('d-none');
        } else {
          $('.tfoot_dt').removeClass('d-none');
        }

      });

    });

  }

  exportFiles(type) {

    this.exportAsConfig.type = type;

    this.exportAsService.save(this.exportAsConfig, 'akun_tipe').subscribe(() => { });

  }

  add() {

    let modalConfig = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
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

      that.http.delete(that.apiUrl + '/accAkunTipe/delete/' + id)
        .subscribe(() => {

          that.rerender();

          swal({
            title: 'Deleted!',
            text: 'Data berhasil dihapus.',
            type: 'success',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          });

        });

    });

  }

  edit(id: number) {

    let that = this;
    let akunTipe;

    this.http.get(this.apiUrl + '/accAkunTipe/get/' + id)
      .subscribe(data => {

        akunTipe = data['data'];

        let modalConfig = {
          animated: true,
          keyboard: true,
          backdrop: true,
          ignoreBackdropClick: true,
          initialState: {
            akunTipe: akunTipe
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

      });

  }

  exportAll() {

    var mediaType = 'application/pdf';

    this.http.get(this.apiUrl + '/accAkunTipe/exportAll', { responseType: 'blob' })
      .subscribe((res) => {

        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);

      });

  }

}