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
import { AccUangMukaRealisasiService } from 'src/app/shared/services/acc_uang_muka_realisasi.service';
import { UploadComponent } from '../upload/upload.component';

declare var swal: any;
const MenuName = 'acc_uang_muka_realisasi';
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
  accUangMukaRealisasi = [];
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
    private accUangMukaRealisasiService: AccUangMukaRealisasiService) {
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
        { 'data': 'no_transakai' },
        { 'data': 'tanggal' },
        { 'data': 'no_uang_muka' },
        { 'data': 'tanggal_uang_muka' },
        { 'data': 'nilai_uang_muka' },
        { 'data': 'nilai_realisasi' },
        { 'data': 'keterangan' },
        { 'data': 'is_posting' },

      ],

      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(this.apiUrl + '/accUangMukaRealisasi/list/' + this.status, dataTablesParameters, {})
          .subscribe(resp => {
            this.accUangMukaRealisasi = resp.data;


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

        if (this.accUangMukaRealisasi.length > 0) {
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

  add() {
    let modalConfig = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true,
      size: 'lg',
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
      that.accUangMukaRealisasiService.delete(id).subscribe(data => {
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


    });

  }

  edit(id: number) {
    console.log('EDIT BUTTON ')
    let that = this;
    let accUangMukaRealisasi;
    this.accUangMukaRealisasiService.getByRealisasi(id).subscribe(data => {
      accUangMukaRealisasi = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        size: 'lg',
        class: "modal-lg ",
        initialState: {
          accUangMukaRealisasi: accUangMukaRealisasi
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
  posting(id: number) {
    let that = this;
    let data;
    swal({
      title: 'Yakin akan diposting?',
      text: "Data tidak bisa akan dapat diubah !",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Ya, posting data!',
      cancelButtonText: 'Batal',

      buttonsStyling: false
    }).then(function () {
      that.accUangMukaRealisasiService.posting(id, data).subscribe(data => {

        if (data['status'] == 'OK') {
          that.rerender();
          swal({
            title: 'Info!',
            text: 'Posting berhasil.',
            type: 'success',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          })
        } else {

          swal({
            title: 'Perhatian!',
            text: data['data'],
            type: 'warning',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          })

        }
      });

    });

  }
  viewSlip(id) {
    var mediaType = 'application/pdf';
    this.accUangMukaRealisasiService.getPdfSlip(id).subscribe(
      (res) => {
        // // console.log(res);
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
        // var blob = new Blob([res], { type: mediaType });
        // saveAs(blob, 'report.pdf');
      }
    );
  }


  onChangeStatus() {
    console.log(this.status_update);

  }

  upload(id: number){
    let that = this;
    let accUangMukaRealisasi;
    this.accUangMukaRealisasiService.getById(id).subscribe(data =>{
      accUangMukaRealisasi = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        size: 'lg',
        initialState: {
          accUangMukaRealisasi: accUangMukaRealisasi
        }
      };
      this.bsModalRef = this.bsModalService.show(UploadComponent, modalConfig);
       this.bsModalRef.content.event.subscribe(data => {

        // let t = $('#datatables').DataTable().ajax.reload();
        // t.draw();
        that.rerender();
      });
    }, error => {
    })
  }

    download(id) {
    this.accUangMukaRealisasiService.getById(id).subscribe(data => {
      // console.log(data);
      let filename=data['data']['file_info']['name']
     this.accUangMukaRealisasiService.download(id, filename);
    });
  }

  deleteUpload(id: number) {
  let that = this;

  swal({
    title: 'Yakin akan menghapus file?',
    text: 'File bukti akan dihapus!',
    type: 'warning',
    showCancelButton: true,
    confirmButtonClass: 'btn btn-success',
    cancelButtonClass: 'btn btn-danger',
    confirmButtonText: 'Ya, hapus file!',
    cancelButtonText: 'Batal',
    buttonsStyling: false
  }).then(function () {

    that.accUangMukaRealisasiService.deleteUpload(id)
      .subscribe((res: any) => {

        if (res.status === 'OK') {
          that.rerender();

          swal({
            title: 'Deleted!',
            text: 'File berhasil dihapus.',
            type: 'success',
            confirmButtonClass: 'btn btn-success',
            buttonsStyling: false
          });
        } else {
          swal({
            title: 'Gagal!',
            text: res.message || 'Gagal menghapus file.',
            type: 'error',
            confirmButtonClass: 'btn btn-danger',
            buttonsStyling: false
          });
        }

      });

  });
}


}
