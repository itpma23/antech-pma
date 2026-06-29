import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SERVER_API_URL, SERVER_PATH_URL } from 'src/app/app.constants';

import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PrcPpService } from 'src/app/shared/services/prc_pp.service';
import { Router } from '@angular/router';
import { ApprovalComponent } from '../approval/approval.component';
import { PrcApprovallSettingService } from 'src/app/shared/services/prc_approvall_setting.service';
import { ApprovalPoComponent } from '../approval_po/approval_po.component';
import { UploadComponent } from '../upload/upload.component';
import { PpStatusApprovalComponent } from '../../pp-status-approval/pp_status_approval.component';
import { NotifCountService } from 'src/app/shared/services/notifCount.service';

declare var swal: any;
const MenuName = 'prc_approval';
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
  PrcPp = [];
  //public dataTable: DataTable;

  bsModalRef: BsModalRef;
  dbName;
  pathName;
  PATH_URL;
  accessButton: any;
  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private PrcPpService: PrcPpService,
    private prcApprovallSettingService: PrcApprovallSettingService,
    private router: Router, private notifCountService: NotifCountService,) {
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
  const that = this;

  this.dtOptions = {
    pagingType: 'simple_numbers',
    pageLength: 10,
    serverSide: true,
    processing: true,
    autoWidth: false,

    responsive: {
      details: {
        type: 'column',
        target: 0
      }
    },

    order: [[3, 'desc']], // tanggal

    language: {
      search: "",
      searchPlaceholder: "Cari",
      lengthMenu: "_MENU_"
    },

    ajax: (params: any, callback) => {
      this.http
        .post<DataTablesResponse>(
          this.apiUrl + '/PrcPp/listByUserApprove',
          params
        )
        .subscribe(resp => {
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: resp.data
          });
        });
    },

    columnDefs: [
      {
        className: 'control',
        orderable: false,
        targets: 0
      },

      { responsivePriority: 1, targets: 2 }, // ✅ No PP PALING PRIORITAS
      { responsivePriority: 2, targets: 1 }, // Lokasi
      { responsivePriority: 3, targets: 3 }, // Tanggal
      { responsivePriority: 100, targets: 4 }, // Catatan (boleh hilang dulu)
      { responsivePriority: 4, targets: 5 }, // Status
      { responsivePriority: 5, targets: 6 }  // Aksi
    ],

    columns: [
      {
        data: null,
        defaultContent: '',
        width: '30px'
      },
      { data: 'lokasi' },
      { data: 'no_pp' },
      { data: 'tanggal' },
      { data: 'catatan' },
      {
        data: null,
        render: (data) => this.getStatusPP(data)
      },
      {
        data: null,
        orderable: false,
        searchable: false,
        render: (data) => `
          <div class="text-right">
            <a href="#" class="btn btn-simple btn-warning btn-icon btn-upload" data-id="${data.id}">
              <i class="material-icons">file_upload</i>
            </a>
            ${data.upload_file ? `
            <a href="#" class="btn btn-simple btn-warning btn-icon btn-download" data-id="${data.id}">
              <i class="material-icons">file_download</i>
            </a>` : ''}
            <a href="#" class="btn btn-simple btn-warning btn-icon btn-status" data-id="${data.id}">
              <i class="material-icons">list</i>
            </a>
            <a href="#" class="btn btn-simple btn-warning btn-icon btn-approve" data-id="${data.id}">
              <i class="material-icons">person</i>
            </a>
          </div>
        `
      }
    ],

    drawCallback: () => {
      that.bindTableActions();
    }
  };
}

bindTableActions() {
  const that = this;

  $('#mytable').off('click');

  $('#mytable').on('click', '.btn-upload', function (e) {
    e.preventDefault();
    that.upload($(this).data('id'));
  });

  $('#mytable').on('click', '.btn-download', function (e) {
     e.preventDefault();
    that.download($(this).data('id'));
  });

  $('#mytable').on('click', '.btn-status', function (e) {
     e.preventDefault();
    that.statusApproval($(this).data('id'));
  });

  $('#mytable').on('click', '.btn-approve', function (e) {
     e.preventDefault();
    that.approval($(this).data('id'));
  });
}


  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  getTipe(tipe) {
    let nama = ""

    return nama;
  }
  getStatusPP(p) {
    let status = ""
    if (p.last_approve_position == '' && p.status == '') {
      status = "Belum diajukan Approval";
    }
    else if (p.status != 'READY_PO' && p.status != 'REJECTED' && p.status != 'CLOSED' ) {
      status ='menunggu approval '+ p.last_approve_position;
    }
    else {
      status = p.status;
    }
    return status
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
       // reload data TANPA reset paging
dtInstance.ajax.reload(null, false);
      setTimeout(() => {
       // this.dtTrigger.next();

        if (this.PrcPp.length > 0) {
          $('.tfoot_dt').addClass('d-none');
        } else {
          $('.tfoot_dt').removeClass('d-none');
        }
      });
    });
  }

  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, 'PrcPp').subscribe(() => { });
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
      that.PrcPpService.delete(id).subscribe(data => {
        // let t = $('#datatables').DataTable().ajax.reload();
        // t.draw();
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



  approval(id: number) {

    let that = this;
    let PrcPp;
    this.PrcPpService.getById(id).subscribe(data => {
      PrcPp = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        size: 'lg',
        class: "modal-lg ",
        initialState: {
          PrcPp: PrcPp
        }
      };
      // console.log(PrcPp)
      this.prcApprovallSettingService.getByLokasiKodeKaryawan(PrcPp['lokasi_id'], PrcPp['last_approve_position'], PrcPp['last_approve_user']).subscribe(a => {

        if (a['data']['is_ready_po'] == 0) {
          this.bsModalRef = this.bsModalService.show(ApprovalComponent, modalConfig);

        } else {
          this.bsModalRef = this.bsModalService.show(ApprovalPoComponent, modalConfig);
        }
        this.bsModalRef.content.event.subscribe(data => {
          this.notifCountService.sendMessage('change');
          that.rerender();
        });
      });



    }, error => {

    });

  }
  statusApproval(id: number) {
    let that = this;
    let PrcPp;
    this.PrcPpService.getById(id).subscribe(data => {
      PrcPp = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        size: 'lg',
        class: "modal-lg ",
        initialState: {
          PrcPp: PrcPp
        }
      };
      this.bsModalRef = this.bsModalService.show(PpStatusApprovalComponent, modalConfig);




    }, error => {

    });

  }
  viewSlip(id) {
    var mediaType = 'application/pdf';
    this.PrcPpService.getPdfSlip(id).subscribe(
      (res) => {
        // console.log(res);
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
        // var blob = new Blob([res], { type: mediaType });
        // saveAs(blob, 'report.pdf');
      }
    );
  }

  upload(id: number) {
    let that = this;
    let PrcPp;
    this.PrcPpService.getById(id).subscribe(data => {
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
    this.PrcPpService.getById(id).subscribe(data => {
      // console.log(data);
      let filename=data['data']['file_info']['name']
     this.PrcPpService.download(id, filename);
    });
  }


  detail(id: number) {
    this.router.navigate(['PrcPp/detail', id.toString(), { previousUrl: this.router.url }]);

  }
}
function StatusApprovalComponent(StatusApprovalComponent: any, modalConfig: { animated: boolean; keyboard: boolean; backdrop: boolean; ignoreBackdropClick: boolean; size: string; class: string; initialState: { PrcPp: any; }; }): BsModalRef {
  throw new Error('Function not implemented.');
}

