import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SERVER_API_URL, SERVER_PATH_URL } from 'src/app/app.constants';
import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AccPeriodeAkuntingService } from 'src/app/shared/services/acc_periode_akunting.service';
import { TrkKegiatanKendaraan } from 'src/app/shared/models/trk_kegiatan_kendaraan.model';
import { TrkKegiatanKendaraanService } from 'src/app/shared/services/trk_kegiatan_kendaraan.service';
import { isNullOrUndefined } from 'util';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { FormBuilder, FormControl } from '@angular/forms';

declare var swal: any;
const MenuName = 'traksi-proses-alokasi';
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
  periodeAkunting = [];
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
    private accPeriodeAkuntingService: AccPeriodeAkuntingService,
    private trkKegiatanKendaraanService: TrkKegiatanKendaraanService,
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
        // {
        //   'data': 'status',
        // }

      ],

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
          .post<DataTablesResponse>(this.apiUrl + '/accPeriodeAkunting/list', dataTablesParameters, {})
          .subscribe(resp => {
            this.periodeAkunting = resp.data;

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

        if (this.periodeAkunting.length > 0) {
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
  proses(id) {
    let that = this;
    swal({
      title: 'Yakin akan melakukan proses?',
      text: "Proses Alokasi Traksi",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Ya, Lakukan Proses',
      cancelButtonText: 'Batal',

      buttonsStyling: false
    }).then(function () {
      var currentdate = new Date();
      that.trkKegiatanKendaraanService.startProses(id).subscribe(data => {
        var currentdate2 = new Date();
        let m="start:"+ currentdate.getDate() + "/"
        + (currentdate.getMonth()+1)  + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds() +
        " end:"+currentdate2.getDate() + "/"
        + (currentdate2.getMonth()+1)  + "/"
        + currentdate2.getFullYear() + " @ "
        + currentdate2.getHours() + ":"
        + currentdate2.getMinutes() + ":"
        + currentdate2.getSeconds();
        if (data['status'] == 'OK') {
          that.rerender();
          swal({
            title: 'Info!',
            text: 'Proses Selesai.'+"\n"+m,
            type: 'success',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          })
        } else {

          swal({
            title: 'Perhatian!',
            text: data['data'],
            type: 'warning',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          })

        }

      });


    });

  }

  view(id) {
    let jenis = "0";

    // this.trkKegiatanKendaraanService.getLaporanGaji(id,jenis).subscribe((res:any) => {
    //   console.log(res);
    //   var fileURL = URL.createObjectURL(res);
    //   window.open(fileURL);

    // });

  }


  detail(id: number) {
    this.router.navigate(['akun/detail', id.toString(), { previousUrl: this.router.url }]);

  }
}
