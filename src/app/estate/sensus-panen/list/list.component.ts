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
import { EstSensusPanenService } from 'src/app/shared/services/est_sensus_panen.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { formatDate } from '@angular/common';
import { isNullOrUndefined } from 'util';

declare var swal: any;

const MenuName = 'est_sensus_panen';

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
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  sensus_panen = [];
  accessButton: any;
  parameterForm:any;
  dataSelectLokasi: any;
  //public dataTable: DataTable;

  bsModalRef: BsModalRef;
  dbName;
  pathName;
  PATH_URL;
  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private EstSensusPanenService: EstSensusPanenService,
    private router: Router, private builder: FormBuilder,) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;
    let toDate: Date = new Date();
    let startdate = new Date(toDate.getFullYear(), 0, 1)// 1 Januari tahun sekarang
    this.parameterForm = this.builder.group({
      // customer: new FormControl([]),
      afdeling: new FormControl([]),
      // tanggal_mulai: new FormControl(new Date(2022, 0, 1), Validators.required),
      // tanggal_akhir: new FormControl(toDate, Validators.required),

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

        // {
        //   'data': 'no_bukti',
        // },
        {
          'data': 'lokasi',
          // 'width': "10%",
          // 'target': [1]
        },
        {
          'data': 'afdeling',
          // 'width': "10%",
          // 'target': [1]
        },
        {
          'data': 'tahun',
          // 'width': "10%",
          // 'target': [1]
        },
        {
          'data': 'bulan',
          // 'width': "10%",
          // 'target': [1]
        },
        {
          'data': 'keterangan',
          // 'width': "10%",
          // 'target': [1]
        },

      ],
      ajax: (dataTablesParameters: any, callback) => {

        let afdeling_id;
        if (isNullOrUndefined(this.parameterForm.get('afdeling').value) != true) {
          if (isNullOrUndefined(this.parameterForm.get('afdeling').value!.id)) {
            afdeling_id = null
          } else {
            afdeling_id = this.parameterForm.get('afdeling').value.id;
          }
        } else {
          afdeling_id = null
        }

        let parameter = {
          'afdeling_id': afdeling_id,
          // 'tgl_mulai': formatDate(this.parameterForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
          // 'tgl_akhir': formatDate(this.parameterForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),

        };
        /* End Parameter */

        dataTablesParameters['parameter'] = parameter;
        console.log(parameter)

        this.http
          .post<DataTablesResponse>(this.apiUrl + '/estSensusPanen/list', dataTablesParameters, {})
          .subscribe(resp => {
            this.sensus_panen = resp.data;

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
  private loadSelect2(): void {

    this.GbmOrganisasiService.getAllByType('AFDELING').subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });

      });

    });
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload(null, false);
      setTimeout(() => {
        //this.dtTrigger.next();

        if (this.sensus_panen.length > 0) {
          $('.tfoot_dt').addClass('d-none');
        } else {
          $('.tfoot_dt').removeClass('d-none');
        }
      });
    });
  }

  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, 'produksipanen').subscribe(() => { });
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
      that.EstSensusPanenService.delete(id).subscribe(data => {

        that.rerender();
        swal({
          title: 'Deleted!',
          text: 'Data berhasil dihapus.',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        });

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
    let estSensusPanen;
    this.EstSensusPanenService.getById(id).subscribe(data => {
      estSensusPanen = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        class: "modal-lg ",
        initialState: {
          sensus_panen: estSensusPanen
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
    this.EstSensusPanenService.getPdfSlip(id).subscribe(
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
