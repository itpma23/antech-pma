import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SERVER_API_URL, SERVER_PATH_URL } from 'src/app/app.constants';

import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PrcPoService } from 'src/app/shared/services/prc_po.service';
import { Router } from '@angular/router';
import { ApprovalComponent } from '../approval/approval.component';
import { PrcApprovallSettingPoService } from 'src/app/shared/services/prc_approvall_setting_po.service';
import { ApprovalLastComponent } from '../approval_last/approval_last.component';
import { PpStatusApprovalComponent } from '../../pp-status-approval/pp_status_approval.component';
import { NotifCountService } from 'src/app/shared/services/notifCount.service';
import { PrcPpService } from 'src/app/shared/services/prc_pp.service';

declare var swal: any;

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
  private apiUrl = SERVER_API_URL;
  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  exportAsConfig: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'mytable',
  };
  PrcPo = [];
  //public dataTable: DataTable;

  bsModalRef: BsModalRef;
  dbName;
  pathName;
  PATH_URL;
  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private PrcPoService: PrcPoService,
    private prcApprovallSettingService: PrcApprovallSettingPoService,
    private PrcPpService: PrcPpService,
    private router: Router, private notifCountService: NotifCountService,) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;

  }

  ngOnInit() {
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
          this.apiUrl + '/PrcPo/listByUserApprove',
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

      { responsivePriority: 1, targets: 2 }, // ✅ No PO
      { responsivePriority: 2, targets: 6 }, // ✅ No PP
      { responsivePriority: 3, targets: 8 }, // Status
      { responsivePriority: 4, targets: 3 }, // Tanggal
      { responsivePriority: 5, targets: 4 }, // Supplier

      { responsivePriority: 100, targets: 7 }, // Catatan
      { responsivePriority: 101, targets: 5 }, // No Ref
      { responsivePriority: 102, targets: 1 }, // Lokasi
      { responsivePriority: 103, targets: 9 }  // Revisi
    ],

    columns: [
      {
        data: null,
        defaultContent: '',
        width: '30px'
      },
      { data: 'lokasi' },
      { data: 'no_po' },
      { data: 'tanggal' },
      { data: 'nama_supplier' },
      { data: 'no_quotation' },
      {
        data: 'pp_detail',
        orderable: false,
        render: (pp) => {
          if (!pp || !pp.length) return '-';
          return pp.map(x =>
            `<a href="javascript:void(0)" class="text-info btn-view-pp" data-id="${x.pp_id}">
              ${x.no_pp}
            </a>`
          ).join('<br>');
        }
      },
      { data: 'catatan' },
      {
        data: null,
        render: (data) => this.getStatusPo(data)
      },
      { data: 'revisi_ke' },
      {
        data: null,
        orderable: false,
        searchable: false,
        render: (data) => `
          <div class="text-right">
            ${data.quotation_id ? `
            <a href="#" class="btn btn-simple btn-warning btn-icon btn-quotation"
               data-id="${data.quotation_id}">
              <i class="material-icons">list</i>
            </a>` : ''}

            <a href="#" class="btn btn-simple btn-warning btn-icon btn-slip"
               data-id="${data.id}">
              <i class="material-icons">picture_as_pdf</i>
            </a>

            <a href="#" class="btn btn-simple btn-warning btn-icon btn-approve"
               data-id="${data.id}">
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

  $('#mytable').on('click', '.btn-view-pp', function (e) {
    e.preventDefault();
    that.viewSlipPP($(this).data('id'));
  });

  $('#mytable').on('click', '.btn-quotation', function (e) {
    e.preventDefault();
    that.showQuotation($(this).data('id'));
  });

  $('#mytable').on('click', '.btn-slip', function (e) {
    e.preventDefault();
    that.viewSlip($(this).data('id'));
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
  getStatusPo(p) {
    let status = ""
    if (p.last_approve_position == '' && p.status == '') {
      status = "Belum diajukan Approval";
    }
    else if (p.status != 'RELEASE' && p.status != 'REJECTED' && p.status != 'CLOSED' ) {
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

        if (this.PrcPo.length > 0) {
          $('.tfoot_dt').addClass('d-none');
        } else {
          $('.tfoot_dt').removeClass('d-none');
        }
      });
    });
  }

  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, 'PrcPo').subscribe(() => { });
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
      that.PrcPoService.delete(id).subscribe(data => {
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
    let PrcPo;
    this.PrcPoService.getById(id).subscribe(data => {
      PrcPo = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        size: 'lg',
        class: "modal-lg ",
        initialState: {
          PrcPo: PrcPo
        }
      };

      this.prcApprovallSettingService.getByLokasiKodeKaryawan(PrcPo['lokasi_id'], PrcPo['last_approve_position'], PrcPo['last_approve_user'],PrcPo['grand_total']).subscribe(a => {

        if (a['data']['is_finish'] == 0) {
          this.bsModalRef = this.bsModalService.show(ApprovalComponent, modalConfig);

        } else {
          this.bsModalRef = this.bsModalService.show(ApprovalLastComponent, modalConfig);
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
    let PrcPo;
    this.PrcPoService.getById(id).subscribe(data => {
      PrcPo = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        size: 'lg',
        class: "modal-lg ",
        initialState: {
          PrcPo: PrcPo
        }
      };
      this.bsModalRef = this.bsModalService.show(PpStatusApprovalComponent, modalConfig);




    }, error => {

    });

  }
  viewSlip(id) {
    var mediaType = 'application/pdf';
    this.PrcPoService.getPdfSlip(id).subscribe(
      (res) => {
        // console.log(res);
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
        // var blob = new Blob([res], { type: mediaType });
        // saveAs(blob, 'report.pdf');
      }
    );
  }
  viewSlipPP(id) {
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

  showQuotation(id: number) {
    this.router.navigate(['prc/quotation/detail', id.toString(),{previousUrl: this.router.url}]);

  }
  detail(id: number) {
    this.router.navigate(['PrcPo/detail', id.toString(), { previousUrl: this.router.url }]);

  }
}
function StatusApprovalComponent(StatusApprovalComponent: any, modalConfig: { animated: boolean; keyboard: boolean; backdrop: boolean; ignoreBackdropClick: boolean; size: string; class: string; initialState: { PrcPo: any; }; }): BsModalRef {
  throw new Error('Function not implemented.');
}

