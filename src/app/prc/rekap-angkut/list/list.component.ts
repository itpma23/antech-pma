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
import { PrcRekapAngkutService } from 'src/app/shared/services/prc_rekap_angkut.service';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { formatDate } from '@angular/common';
import { isNullOrUndefined } from 'util';

declare var swal: any;
const MenuName = 'prc_rekap_angkut';
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
  slsRekapAngkut = [];
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  //public dataTable: DataTable;

  bsModalRef: BsModalRef;
  dbName;
  pathName;
  PATH_URL;
  accessButton: any;
  parameterForm: any;
  dataSelectLokasi: any;
  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private slsRekapAngkutService: PrcRekapAngkutService,
    private router: Router, private builder: FormBuilder,
    private gbmOrganisasiService: GbmOrganisasiService,) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;

    let toDate: Date = new Date();
    // let datethn: Date = new Date("20-03-2022");
    let startdate = new Date(toDate.getFullYear(), 0, 1)// 1 Januari tahun sekarang
    this.parameterForm = this.builder.group({
      lokasi: new FormControl([]),
      tanggal_mulai: new FormControl("01-01-22", Validators.required),
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
      order: [[ 3, "desc" ]],
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

        {
          'data': 'lokasi',
          //'width': "20%",
        },

        {
          'data': 'no_rekap',
         // 'width': "12%",
        },
        {
          'data': 'tanggal',
         // 'width': "10%",
        },
        {
          'data': 'spk',
         // 'width': "10%",
        },
        {
          'data': 'nama_supplier',
         // 'width': "10%",
        },
        {
          'data': 'nama_supplier',
          'width': "20%",
        },
        {
          'data': 'no_kontrak',
         // 'width': "10%",
        },
        // {
        //   'data': 'sisa',
        //  // 'width': "10%",
        // },

      ],

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
         console.log(parameter)

        this.http
          .post<DataTablesResponse>(this.apiUrl + '/PrcRekapAngkut/list', dataTablesParameters, {})
          .subscribe(resp => {

            this.slsRekapAngkut = resp.data;

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

    this.gbmOrganisasiService.getAllByType("UNIT").subscribe(x => {
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

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload(null, false);
      setTimeout(() => {
        //this.dtTrigger.next();

        if (this.slsRekapAngkut.length > 0) {
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
      //size: 'lg',
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
      that.slsRekapAngkutService.delete(id).subscribe(data => {

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

  edit(id: number) {
    let that = this;
    let pksslsRekapAngkut;
    this.slsRekapAngkutService.getById(id).subscribe(data => {
      pksslsRekapAngkut = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        class: "modal-lg ",
        initialState: {
          slsRekapAngkut: pksslsRekapAngkut
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
    this.slsRekapAngkutService.getPdfSlip(id).subscribe(
      (res) => {
        // console.log(res);
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
        // var blob = new Blob([res], { type: mediaType });
        // saveAs(blob, 'report.pdf');
      }
    );
  }
  viewCover(id) {
    var mediaType = 'application/pdf';
    this.slsRekapAngkutService.getPdfCover(id).subscribe(
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
    this.router.navigate(['kasbank/detail', id.toString(), { previousUrl: this.router.url }]);

  }
}
