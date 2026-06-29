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
import { HrmsPengajuanCutiService } from 'src/app/shared/services/hrms_pengajuan_cuti.service';
import { Router } from '@angular/router';
import { ApprovalComponent } from '../approval/approval.component';
import { saveAs } from 'file-saver';
import { UploadComponent } from '../upload/upload.component';
import { RincianComponent } from '../rincian/rincian.component';

declare var swal: any;
const MenuName = 'hrms_pengajuan_cuti';
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
  HrmsPengajuanCuti = [];
  //public dataTable: DataTable;

  bsModalRef: BsModalRef;
  dbName;
  pathName;
  PATH_URL;
  accessButton: any;
  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private HrmsPengajuanCutiService: HrmsPengajuanCutiService,
    private router: Router,) {
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
      order: [[ 0, "desc" ]],
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

        // { 'data': 'tanggal' },
        { 'data': 'karyawan' },
        { 'data': 'dari_tanggal' },
        { 'data': 'sampai_tanggal' },
        { 'data': 'cuti' },
        { 'data': 'status' },
        { 'data': 'jenis_absensi' },

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
          .post<DataTablesResponse>(this.apiUrl + '/HrmsPengajuanCuti/listByUserEntry', dataTablesParameters, {})
          .subscribe(resp => {

            this.HrmsPengajuanCuti = resp.data;

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
  getStatusPo(p) {
    let status = ""
    if (p.last_approve_position == '' && p.status == '') {
      status = "Belum diajukan Approval";
    }
    else if (p.status != 'APPROVED' && p.status != 'RELEASE' && p.status != 'REJECTED' && p.status != 'CLOSED' ) {
      status ='menunggu approval '+ p.last_approve_position;
    }
    else {
      status = p.status;
    }
    return status
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload(null, false);
      setTimeout(() => {
        //this.dtTrigger.next();

        if (this.HrmsPengajuanCuti.length > 0) {
          $('.tfoot_dt').addClass('d-none');
        } else {
          $('.tfoot_dt').removeClass('d-none');
        }
      });
    });
  }

  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, 'HrmsPengajuanCuti').subscribe(() => { });
  }
  add() {
    let modalConfig = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true,
      //size: 'lg',
      class: "modal-lg",

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

  rincianCuti() {
    let modalConfig = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true,
      //size: 'lg',
      // class: "modal-lg",

    };
    this.bsModalRef = this.bsModalService.show(RincianComponent, modalConfig);
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
      that.HrmsPengajuanCutiService.delete(id).subscribe(data => {
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
    let HrmsPengajuanCuti;
    this.HrmsPengajuanCutiService.getById(id).subscribe(data => {
      HrmsPengajuanCuti = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        class: "modal-lg ",
        initialState: {
          HrmsPengajuanCuti: HrmsPengajuanCuti
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
  approval(id: number) {
    let that = this;
    let HrmsPengajuanCuti;
    this.HrmsPengajuanCutiService.getById(id).subscribe(data => {
      HrmsPengajuanCuti = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        size: 'lg',
        class: "my-class",
        initialState: {
          HrmsPengajuanCuti: HrmsPengajuanCuti
        }
      };
      this.bsModalRef = this.bsModalService.show(ApprovalComponent, modalConfig);
      this.bsModalRef.content.event.subscribe(data => {

        // let t = $('#datatables').DataTable().ajax.reload();
        // t.draw();
        that.rerender();
      });


    }, error => {

    });

  }
  // statusApproval(id: number) {
  //   let that = this;
  //   let PrcPp;
  //   this.PrcPpService.getById(id).subscribe(data => {
  //     PrcPp = data['data'];

  //     let modalConfig = {
  //       animated: true,
  //       keyboard: true,
  //       backdrop: true,
  //       ignoreBackdropClick: true,
  //       size: 'lg',
  //       class: "modal-lg ",
  //       initialState: {
  //         PrcPp: PrcPp
  //       }
  //     };
  //     this.bsModalRef = this.bsModalService.show(PpStatusApprovalComponent, modalConfig);




  //   }, error => {

  //   });

  // }
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
      that.HrmsPengajuanCutiService.posting(id, data).subscribe(data => {

        that.rerender();
        swal({
          title: 'Info!',
          text: 'Posting berhasil.',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
      });

    });

  }
  upload(id: number) {
    let that = this;
    let PrcPp;
    this.HrmsPengajuanCutiService.getById(id).subscribe(data => {
      PrcPp = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        size: 'lg',
       // class: "modal-lg ",
        initialState: {
          PrcPp: PrcPp
        }
      };
      this.bsModalRef = this.bsModalService.show(UploadComponent, modalConfig);
      this.bsModalRef.content.event.subscribe(data => {

        // let t = $('#datatables').DataTable().ajax.reload();
        // t.draw();
        that.rerender();
      });
    }, error => {
    });
  }
  
  download(id) {
    this.HrmsPengajuanCutiService.getById(id).subscribe(data => {
      // console.log(data);
      let filename=data['data']['file_info']['name']
     this.HrmsPengajuanCutiService.download(id, filename);
    });
  }
  
  viewSlip(id) {
    var mediaType = 'application/pdf';
    this.HrmsPengajuanCutiService.getPdfSlip(id).subscribe(
      (res) => {
        // console.log(res);
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
        // var blob = new Blob([res], { type: mediaType });
        // saveAs(blob, 'report.pdf');
      }
    );
  }

  showQuotation(id: number) {
    this.router.navigate(['prc/quotation/detail', id.toString(),{previousUrl: this.router.url}]);

  }
  viewCekHarga(id: number) {
    var mediaType = 'application/pdf';
    this.HrmsPengajuanCutiService.getPdfSlipCekHarga(id).subscribe(
      (res) => {
        // console.log(res);
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
        // var blob = new Blob([res], { type: mediaType });
        // saveAs(blob, 'report.pdf');
      }
    );
  }
  detail(id: number) {
    this.router.navigate(['HrmsPengajuanCuti/detail', id.toString(), { previousUrl: this.router.url }]);

  }
}
