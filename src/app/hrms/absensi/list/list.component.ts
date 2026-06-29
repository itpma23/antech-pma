import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SERVER_API_URL,SERVER_PATH_URL } from 'src/app/app.constants';
import { AddComponent } from '../add/add.component';
import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EditComponent } from '../edit/edit.component';
import { Router } from '@angular/router';
import { HrmsAbsensiService } from 'src/app/shared/services/hrms_absensi.service';
import PerfectScrollbar from 'perfect-scrollbar';
import { ImportComponent } from '../import/import.component';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import { formatDate } from '@angular/common';

declare var swal: any;
const MenuName='hrms_absensi';
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
  absensi = [];
  //public dataTable: DataTable;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }

  bsModalRef: BsModalRef;
  dbName;
  pathName;
  PATH_URL;
  dataSelectLokasi: any;
  accessButton: any;
  parameterForm: any;
  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private hrmsAbsensiService: HrmsAbsensiService, private builder: FormBuilder,
    private gbmOrganisasiService: GbmOrganisasiService,
    private router: Router,) {
      this.dbName= this.authenticationService.getUserDB();
      this.pathName= this.authenticationService.getUserPath();
      this.PATH_URL=SERVER_PATH_URL;
      const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      const elemSidebar = <HTMLElement>document.querySelector('.sidebar-wrapper');
      setTimeout(() => {
        let ps = new PerfectScrollbar(elemMainPanel);
        ps.update();
        let ps2 = new PerfectScrollbar(elemSidebar);
        ps2.update();

      }, 1000);

      let toDate: Date = new Date();
      let startdate=new Date(toDate.getFullYear(),0,1)// 1 Januari tahun sekarang
      this.parameterForm = this.builder.group({
        lokasi: new FormControl([]),
        tanggal_mulai: new FormControl(startdate, Validators.required),
        tanggal_akhir: new FormControl(toDate, Validators.required),

      });

  }

  ngOnInit() {
    this.authenticationService.getAccessButton(MenuName).subscribe((u)=>{
      this.accessButton= u['data'];
      console.log(this.accessButton);


    });
    this.loadSelect2();
    this.loadDatatable();
  }

  showData() {
    console.log(this.parameterForm.value)
    this.rerender()

  }

  loadDatatable() {

    let that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      //responsive: true,
      order: [[2, "desc"]],
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
          'data': 'nama',
          'width': "20%",
          // 'target': [0]
        },
        {
          'data': 'lokasi',
          'width': "15%",
        },
        {
          'data': 'tanggal',
          // 'width': "30%",
          // 'target': [1]
        },
        {
          'data': 'jenis_absensi',

        },
        {
          'data': 'c.jumlah_jam',
          // 'width': "10%",
          // 'target': [1]
        },
        {
          'data': 'tipe_lembur',
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
        if (isNullOrUndefined(this.parameterForm.get('lokasi').value) != true) {
          if (isNullOrUndefined(this.parameterForm.get('lokasi').value!.id)) {
            lokasi_id = null
          } else {
            lokasi_id = this.parameterForm.get('lokasi').value.id;
          }
        } else {
          lokasi_id = null
        }
        let parameter = {
          'lokasi_id': lokasi_id,
          'tgl_mulai': formatDate(this.parameterForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
          'tgl_akhir': formatDate(this.parameterForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
        };
         /* End Parameter */

         dataTablesParameters['parameter'] = parameter;

        this.http
          .post<DataTablesResponse>(this.apiUrl + '/hrmsAbsensi/list', dataTablesParameters, {})
          .subscribe(resp => {
            this.absensi = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      }
    };
  }
  private loadSelect2(): void {

    this.gbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });

      });

    });
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  import() {
    let modalConfig = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true,
      //size: 'lg',
      class: "modal-lg ",

    };
    this.bsModalRef = this.bsModalService.show(ImportComponent, modalConfig);
    this.bsModalRef.content.event.subscribe(result => {
      if (result == 'OK') {
        // let t= $('#datatables').DataTable().ajax.reload();
        // t.draw();
        this.rerender();
      }
    });
  }
  getTipe(tipe){
    let nama=""
    if (tipe=="0"){
      nama="Kas";

    }else if (tipe=="1"){
      nama="Bank";

    }else if (tipe=="2"){
      nama="Piutang";

    }else if (tipe=="3"){
      nama="Hutang";

    }else if (tipe=="4"){
      nama="Modal";

    }else if (tipe=="5"){
      nama="Biaya";

    }else if (tipe=="6"){
      nama="Pendapatan";

    }
return nama;
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload(null, false);
      setTimeout(() => {
        //this.dtTrigger.next();

        if (this.absensi.length > 0) {
          $('.tfoot_dt').addClass('d-none');
        } else {
          $('.tfoot_dt').removeClass('d-none');
        }
      });
    });
  }

  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, 'akun').subscribe(() => { });
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
    this.bsModalRef = this.bsModalService.show(AddComponent,modalConfig);
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
      that.hrmsAbsensiService.delete(id).subscribe(data => {
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

      // swal({
      //   title: 'Deleted!',
      //   text: 'Data Berhasil dihapus.',
      //   type: 'success',
      //   confirmButtonClass: "btn btn-success",
      //   buttonsStyling: false
      //   })
    });

  }

  edit(id: number) {
    let that = this;
    let absensi;
    this.hrmsAbsensiService.getById(id).subscribe(data => {
      absensi = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        //class: "modal-lg ",
        initialState: {
          absensi: absensi
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
    this.router.navigate(['akun/detail', id.toString(),{previousUrl: this.router.url}]);

  }
}
