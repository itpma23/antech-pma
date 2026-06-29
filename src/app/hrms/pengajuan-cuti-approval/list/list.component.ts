import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SERVER_API_URL, SERVER_PATH_URL } from 'src/app/app.constants';

import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HrmsPengajuanCutiService } from 'src/app/shared/services/hrms_pengajuan_cuti.service';
import { Router } from '@angular/router';
import { ApprovalComponent } from '../approval/approval.component';
import { HrmsApprovallSettingPengajuanCutiService } from 'src/app/shared/services/hrms_approvall_setting_pengajuan_cuti.service';
import { ApprovalLastComponent } from '../approval_last/approval_last.component';
import { NotifCountService } from 'src/app/shared/services/notifCount.service';

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
  HrmsPengajuanCuti = [];
  //public dataTable: DataTable;

  bsModalRef: BsModalRef;
  dbName;
  pathName;
  PATH_URL;
  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private HrmsPengajuanCutiService: HrmsPengajuanCutiService,
    private HrmsApprovallSettingPengajuanCutiService: HrmsApprovallSettingPengajuanCutiService,
    private router: Router, private notifCountService: NotifCountService,) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;

  }

  ngOnInit() {
    this.loadDatatable();
  }

  loadDatatable() {

    let that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      order: [[0, 'desc']],
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
        { 'data': 'tanggal' },
        { 'data': 'dari_tanggal' },
        { 'data': 'sampai_tanggal' },
        { 'data': 'cuti' },
        { 'data': 'status' },
        { 'data': 'karyawan' },
        { 'data': 'jenis_absensi' },

      ],

      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(this.apiUrl + '/HrmsPengajuanCuti/listByUserApprove', dataTablesParameters, {})
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
  getTipe(tipe) {
    let nama = ""

    return nama;
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
// console.log(HrmsPengajuanCuti)
// console.log(HrmsPengajuanCuti['sub_bagian_id'])
      this.HrmsApprovallSettingPengajuanCutiService.getByLokasiKodeKaryawan(HrmsPengajuanCuti['sub_bagian_id'], HrmsPengajuanCuti['last_approve_position'], HrmsPengajuanCuti['last_approve_user']).subscribe(a => {
console.log(a)
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
  // statusApproval(id: number) {
  //   let that = this;
  //   let HrmsPengajuanCuti;
  //   this.HrmsPengajuanCutiService.getById(id).subscribe(data => {
  //     HrmsPengajuanCuti = data['data'];

  //     let modalConfig = {
  //       animated: true,
  //       keyboard: true,
  //       backdrop: true,
  //       ignoreBackdropClick: true,
  //       size: 'lg',
  //       class: "modal-lg ",
  //       initialState: {
  //         HrmsPengajuanCuti: HrmsPengajuanCuti
  //       }
  //     };
  //     this.bsModalRef = this.bsModalService.show(PpStatusApprovalComponent, modalConfig);




  //   }, error => {

  //   });

  // }
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
  detail(id: number) {
    this.router.navigate(['HrmsPengajuanCuti/detail', id.toString(), { previousUrl: this.router.url }]);

  }
  download(id) {
    this.HrmsPengajuanCutiService.getById(id).subscribe(data => {
      // console.log(data);
      let filename=data['data']['file_info']['name']
     this.HrmsPengajuanCutiService.download(id, filename);
    });
  }
}


