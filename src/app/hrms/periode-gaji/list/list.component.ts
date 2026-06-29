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
import { Router } from '@angular/router';
import { HrmsPeriodeGajiService } from 'src/app/shared/services/hrms_periode_gaji.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { isNullOrUndefined } from 'util';

declare var swal: any;
const MenuName = 'hrms_periode_gaji';
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
  periodeGaji = [];
  //public dataTable: DataTable;

  bsModalRef: BsModalRef;
  dbName;
  pathName;
  PATH_URL;
  accessButton: any;
  listForm: any;
  dataSelectLokasi: any[];
  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private hrmsperiodeGajiService: HrmsPeriodeGajiService,
    private router: Router,private builder: FormBuilder,
    private gbmOrganisasiService: GbmOrganisasiService) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;
    this.listForm = this.builder.group({
      lokasi: new FormControl([], ),

    });
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
          'data': 'nama_lokasi',
          'width': "20%",
          // 'target': [0]
        },
        {
          'data': 'nama',
          'width': "20%",
          // 'target': [0]
        },
        {
          'data': 'tgl_awal',
          // 'width': "30%",
          // 'target': [1]
        },
        {
          'data': 'tgl_akhir',
          // 'width': "10%",
          // 'target': [1]
        },
        {
          'data': 'status',
          // 'width': "10%",
          // 'target': [1]
        },
        {
          'data': 'is_close',
          // 'width': "10%",
          // 'target': [1]
        },
        {
          'data': 'is_close',
          // 'width': "10%",
          // 'target': [1]
        }
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
          /* Parameter */

          let lokasi_id;
          if (isNullOrUndefined(this.listForm.get('lokasi').value) != true) {
            if (isNullOrUndefined(this.listForm.get('lokasi').value!.id)) {
              lokasi_id = null
            } else {
              lokasi_id = this.listForm.get('lokasi').value.id;
            }
          } else {
            lokasi_id = null
          }
          let parameter = {
            'lokasi_id': lokasi_id,
           };
           /* End Parameter */
           dataTablesParameters['parameter'] = parameter;
        this.http
          .post<DataTablesResponse>(this.apiUrl + '/hrmsPeriodegaji/list', dataTablesParameters, {})
          .subscribe(resp => {
            this.periodeGaji = resp.data;

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
    this.gbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x=>{
      this.dataSelectLokasi=[];
      x.forEach(d => {
        this.dataSelectLokasi.push({"id":d.id,"text":d.nama});
      });
    });
    this.listForm.controls['lokasi'].valueChanges.subscribe(x => {
      // console.log(x);
      let org_id = x.id;
      this.rerender()

    });
    this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  getTipe(tipe) {
    let nama = ""

    return nama;
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload(null, false);
      setTimeout(() => {
        //this.dtTrigger.next();

        if (this.periodeGaji.length > 0) {
          $('.tfoot_dt').addClass('d-none');
        } else {
          $('.tfoot_dt').removeClass('d-none');
        }
      });
    });
  }

  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, 'data').subscribe(() => { });
  }
  add() {
    let modalConfig = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true,
      //size: 'lg',
      // class: "modal-lg ",

    };
    this.bsModalRef = this.bsModalService.show(AddComponent, modalConfig);
    this.bsModalRef.content.event.subscribe(result => {
      if (result == 'OK') {
        swal({
          title: 'Simpan!',
          text: 'Data Berhasil disimpan.',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
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
      that.hrmsperiodeGajiService.delete(id).subscribe(data => {
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
    let periodeGaji;
    this.hrmsperiodeGajiService.getById(id).subscribe(data => {
      periodeGaji = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        //class: "modal-lg ",
        initialState: {
          periodeGaji: periodeGaji
        }
      };
      this.bsModalRef = this.bsModalService.show(EditComponent, modalConfig);
      this.bsModalRef.content.event.subscribe(data => {

        swal({
          title: 'Simpan!',
          text: 'Data Berhasil diupdate.',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        that.rerender();
      });


    }, error => {

    });

  }
  detail(id: number) {
    this.router.navigate(['akun/detail', id.toString(), { previousUrl: this.router.url }]);

  }
}
