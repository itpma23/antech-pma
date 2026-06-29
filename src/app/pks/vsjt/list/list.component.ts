import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SERVER_API_URL, SERVER_PATH_URL } from 'src/app/app.constants';

import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EditComponent } from '../edit/edit.component';
import { PksSjppService } from 'src/app/shared/services/pks_sjpp.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { GbmCustomerService } from 'src/app/shared/services/gbm_customer.service';
import { SlsKontrakService } from 'src/app/shared/services/sls_kontrak.service';
import { SlsIntruksiService } from 'src/app/shared/services/sls_intruksi.service';
import { isNullOrUndefined } from 'util';
declare var swal: any;

export class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
declare var $: any;
const MenuName = 'pks_sjpp';

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
  PksSjpp = [];
  //public dataTable: DataTable;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }

  bsModalRef: BsModalRef;
  dbName;
  pathName;
  PATH_URL;
  accessButton: any;
  parameterForm: any;
  dataSelectCust;
  dataSelectInstruksi: any[];
  dataSelectKontrak: any[];
  dataSelectStatus: { id: string; text: string; }[];

  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private PksSjppService: PksSjppService,
    private GbmCustomerService: GbmCustomerService,
    private slsIntruksiService: SlsIntruksiService,
    private slsKontrakService: SlsKontrakService,
    private router: Router, private builder: FormBuilder) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;

    let toDate: Date = new Date();
    let startdate = new Date(toDate.getFullYear(), 0, 1)// 1 Januari tahun sekarang
    this.parameterForm = this.builder.group({
      customer: new FormControl([]),
      kontrak: new FormControl([]),
      instruksi: new FormControl([]),
      status: new FormControl([]),
      tanggal_mulai: new FormControl(new Date(2025, 0, 1), Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),

    });

  }

  ngOnInit() {
    this.loadDatatable();
    this.authenticationService.getAccessButton(MenuName).subscribe((u) => {
      this.accessButton = u['data'];
    });
    this.loadSelect2()
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
      order: [[0, "desc"]],
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
          // 'width': "10%",
          //'target': [0]
        },
        { 'data': 'mill' },
        { 'data': 'no_surat_jalan' },
        { 'data': 'no_tiket' },
        { 'data': 'tanggal_timbang' },
        { 'data': 'nama_customer' },
        { 'data': 'no_spk' },

        { 'data': 'no_instruksi' },
        { 'data': 'no_kendaraan' },
        { 'data': 'nama_supir' },

        { 'data': 'tanggal_terima' },
        { 'data': 'netto_customer' },
        { 'data': 'tanggal_terima' },
        { 'data': 'no_tiket' },

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
        let customer_id;
        if (isNullOrUndefined(this.parameterForm.get('customer').value) != true) {
          if (isNullOrUndefined(this.parameterForm.get('customer').value!.id)) {
            customer_id = null
          } else {
            customer_id = this.parameterForm.get('customer').value.id;
          }
        } else {
          customer_id = null
        }
        let kontrak_id;
        if (isNullOrUndefined(this.parameterForm.get('kontrak').value) != true) {
          if (isNullOrUndefined(this.parameterForm.get('kontrak').value!.id)) {
            kontrak_id = null
          } else {
            kontrak_id = this.parameterForm.get('kontrak').value.id;
          }
        } else {
          kontrak_id = null
        }
        let instruksi_id;
        if (isNullOrUndefined(this.parameterForm.get('instruksi').value) != true) {
          if (isNullOrUndefined(this.parameterForm.get('instruksi').value!.id)) {
            instruksi_id = null
          } else {
            instruksi_id = this.parameterForm.get('instruksi').value.id;
          }
        } else {
          instruksi_id = null
        }
        let status_id;
        if (isNullOrUndefined(this.parameterForm.get('status').value) != true) {
          if (isNullOrUndefined(this.parameterForm.get('status').value!.id)) {
            status_id = null
          } else {
            status_id = this.parameterForm.get('status').value.id;
          }
        } else {
          status_id = null
        }
        let parameter = {
          'customer_id': customer_id,
          'kontrak_id': kontrak_id,
          'instruksi_id': instruksi_id,
          'status_id': status_id,
          'tgl_mulai': formatDate(this.parameterForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
          'tgl_akhir': formatDate(this.parameterForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),

        };
        /* End Parameter */

        dataTablesParameters['parameter'] = parameter;
        console.log(parameter)

        this.http
          .post<DataTablesResponse>(this.apiUrl + '/PksSjpp/list', dataTablesParameters, {})
          .subscribe(resp => {
            this.PksSjpp = resp.data;

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

    this.dataSelectStatus = [
      { id:'N', text: 'Belum Diterima' },
      { id:'Y', text: 'Sudah Diterima' }
    ];
    this.GbmCustomerService.getAll().subscribe(x => {
      this.dataSelectCust = [];
      let a = x['data'];
      a.forEach(d => {
        this.dataSelectCust.push({ "id": d.id, "text": d.nama_customer });
      });

    });
    this.parameterForm.controls['customer'].valueChanges.subscribe(x => {
      let customer_id = x.id;
      this.slsKontrakService.getAllbyCustomer(customer_id).subscribe(x => {
        this.dataSelectKontrak = [];
        let i = x['data'];
        console.log(x);
        i.forEach(d => {
          this.dataSelectKontrak.push({ "id": d.id, "text": d.no_spk });
        });
      });
    });
    this.parameterForm.controls['kontrak'].valueChanges.subscribe(x => {
      let kontrak_id = x.id;
      this.slsIntruksiService.getAllByKontrak(kontrak_id).subscribe(x => {
        this.dataSelectInstruksi = [];
        let i = x['data'];
        console.log(x);
        i.forEach(d => {
          this.dataSelectInstruksi.push({ "id": d.id, "text": d.no_transaksi });
        });
      });
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
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload(null, false);
      setTimeout(() => {
        //this.dtTrigger.next();

        if (this.PksSjpp.length > 0) {
          $('.tfoot_dt').addClass('d-none');
        } else {
          $('.tfoot_dt').removeClass('d-none');
        }
      });
    });
  }

  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, 'PksSjpp').subscribe(() => { });
  }


  // add() {
  //   let modalConfig = {
  //     animated: true,
  //     keyboard: true,
  //     backdrop: true,
  //     ignoreBackdropClick: true,
  //     // size: 'xl',
  //     class: "modal-lg ",

  //   };
  //   this.bsModalRef = this.bsModalService.show(AddComponent,modalConfig);
  //   this.bsModalRef.content.event.subscribe(result => {
  //     if (result == 'OK') {
  //       // let t= $('#datatables').DataTable().ajax.reload();
  //       // t.draw();
  //       this.rerender();
  //     }
  //   });
  // }

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
      that.PksSjppService.delete(id).subscribe(data => {
        // let t = $('#datatables').DataTable().ajax.reload();
        // t.draw();
        that.rerender();
        swal({
          title: 'Deleted!',
          text: 'Data berhasil dihapus.',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
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

  edit(id: number) {
    let that = this;
    let PksSjpp;
    this.PksSjppService.getSjCustomerById(id).subscribe(data => {
      PksSjpp = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        class: "modal-lg ",
        initialState: {
          PksSjpp: PksSjpp
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


  viewSlip(id) {
    var mediaType = 'application/pdf';
    this.PksSjppService.getPdfValidasiTimbanganSlip(id).subscribe(
      (res) => {
        // // console.log(res);
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
        // var blob = new Blob([res], { type: mediaType });
        // saveAs(blob, 'report.pdf');
      }
    );
  }


  detail(id: number) {
    this.router.navigate(['PksSjpp/detail', id.toString(), { previousUrl: this.router.url }]);

  }
}
