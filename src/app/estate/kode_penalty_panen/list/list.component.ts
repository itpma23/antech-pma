import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SERVER_API_URL, SERVER_PATH_URL } from 'src/app/app.constants';
// import { AddNewPostComponent } from './components/add-new-post/add-new-post.component';
// import { DeletePostComponent } from './components/delete-post/delete-post.component';
import { AddComponent } from '../add/add.component';
import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EditComponent } from '../edit/edit.component';
import PerfectScrollbar from 'perfect-scrollbar';
import { EstKodeDendaPanenService } from 'src/app/shared/services/est_kode_denda_panen.service';
import { EstKodePenaltyPanen } from 'src/app/shared/models/est_kode_penalty_panen.model';
import { EstKodePenaltyPanenService } from 'src/app/shared/services/est_kode_penalty_panen.service';
import { saveAs } from 'file-saver'
declare var swal: any;
const MenuName = 'est_kode_penalty_panen';
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
  KodeDendaPanen = [];

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
    private kodeDendaPanenService: EstKodePenaltyPanenService) {
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
          
          'visible': false,
          'width': "10%",
          //'target': [0]
        },
        {'data': 'kode', },
        {'data': 'nama', },
        {'data': 'keterangan', },
        {'data': 'nama_akun', },
        {'data': 'users',
          'sortable': false,
         }


      ],

      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(this.apiUrl + '/EstPenaltyPanen/list/' + this.status, dataTablesParameters, {})
          .subscribe(resp => {
            this.KodeDendaPanen = resp.data;


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

        if (this.KodeDendaPanen.length > 0) {
          $('.tfoot_dt').addClass('d-none');
        } else {
          $('.tfoot_dt').removeClass('d-none');
        }
      });
    });

  }

  exportFiles(type) {


    this.kodeDendaPanenService.view_laporan(type).subscribe(
      (res) => {
        // // // console.log(res);
        // var fileURL = URL.createObjectURL(res);
        // window.open(fileURL);
        // // var blob = new Blob([res], { type: mediaType });
        // // saveAs(blob, 'report.pdf');

        if (type == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'penalty_rekap.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
      }
    );
  }

  add() {
    let modalConfig = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true,
      // size: 'lg',
      // class: "modal-lg ",

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
      that.kodeDendaPanenService.delete(id).subscribe(data => {
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
    let that = this;
    let KodeDendaPanen;
    this.kodeDendaPanenService.getById(id).subscribe(data => {
      KodeDendaPanen = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        // size: 'lg',
        // class: "modal-lg ",
        initialState: {
          kodeDendaPanen: KodeDendaPanen
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

  // viewlaporan() {
  //   this.kodeDendaPanenService.view_laporan().subscribe(
  //     (res) => {
  //       // // console.log(res);
  //       var fileURL = URL.createObjectURL(res);
  //       window.open(fileURL);
  //       // var blob = new Blob([res], { type: mediaType });
  //       // saveAs(blob, 'report.pdf');
  //     }
  //   );
  // }


}
