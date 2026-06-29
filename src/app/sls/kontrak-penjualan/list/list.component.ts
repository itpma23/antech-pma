import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SERVER_API_URL, SERVER_PATH_URL } from 'src/app/app.constants';
// import { AddNewPostComponent } from './components/add-new-post/add-new-post.component';
// import { DeletePostComponent } from './components/delete-post/delete-post.component';
import { AddComponent } from '../add/add.component';
import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EditComponent } from '../edit/edit.component';
import PerfectScrollbar from 'perfect-scrollbar';
import { SlsKontrakService } from 'src/app/shared/services/sls_kontrak.service';
import { formatDate } from '@angular/common';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { InvItemService } from 'src/app/shared/services/inv_item.service';

declare var swal: any;
const MenuName = 'sls_kontrak';
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
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.css']
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
  pksKontrak = [];
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  bsModalRef: BsModalRef;
  dbName;
  pathName;
  PATH_URL;
  status = '1';
  isChecked = false;
  checkedList: any;
  status_update: any = "1";

  dataSelectStatus: any;
  dataSelectItem:any;
  parameterForm: any;
  accessButton: any;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private pksKontrakService: SlsKontrakService,
    private router: Router, private builder: FormBuilder,
    private invItemService:InvItemService,) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;

    let toDate: Date = new Date();
    let startdate = new Date(toDate.getFullYear(), 0, 1)// 1 Januari tahun sekarang
    this.parameterForm = this.builder.group({
      // lokasi: new FormControl([]),
      produk: new FormControl([]),
      status: new FormControl([]),
      tanggal_mulai: new FormControl(new Date(2025, 0, 1), Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
    });

    const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
    const elemSidebar = <HTMLElement>document.querySelector('.sidebar-wrapper');
    setTimeout(() => {
      let ps = new PerfectScrollbar(elemMainPanel);
      ps.update();
      let ps2 = new PerfectScrollbar(elemSidebar);
      ps2.update();

    }, 1000);

  }


  ngOnInit() {
    this.loadDatatable();
    this.authenticationService.getAccessButton(MenuName).subscribe((u) => {
      this.accessButton = u['data'];
      // console.log(this.accessButton);


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
      pageLength: 100,
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
          'data': 'no_spk',
          // 'sortable': false,
          // 'width': "15%",
        },
        {
          'data': 'tanggal',
          // 'sortable': false,
          // 'width': "15%",
          //'target': [0]
        },
        {
          'data': 'lokasi',
          // 'width': "10%",
        },
        {
          'data': 'customer',
          // 'width': "15%",
        },

        {
          'data': 'nama_item',
          // 'width': "10%",
        },

        {
          'data': 'users',
          'width': "20%",
        },



      ],

      ajax: (dataTablesParameters: any, callback) => {
        /* Parameter */


        let produk_id;
        if (isNullOrUndefined(this.parameterForm.get('produk').value) != true) {
          if (isNullOrUndefined(this.parameterForm.get('produk').value!.id)) {
            produk_id = null
          } else {
            produk_id = this.parameterForm.get('produk').value.id;
          }
        } else {
          produk_id = null
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
          // 'lokasi_id': lokasi_id,
          'produk_id': produk_id,
          'status_id': status_id,
          'tgl_mulai': formatDate(this.parameterForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
          'tgl_akhir': formatDate(this.parameterForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
        };
        /* End Parameter */
        dataTablesParameters['parameter'] = parameter;
        this.http
          .post<DataTablesResponse>(this.apiUrl + '/SlsKontrak/list/' + this.status, dataTablesParameters, {})
          .subscribe(resp => {
            this.pksKontrak = resp.data;


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
      { id: 'N', text: 'Belum Posting' },
      { id: 'Y', text: 'Sudah Posting' }
    ];

    this.invItemService.getAllProduk().subscribe(x=>{
      console.log(x);
      this.dataSelectItem=[];
      x['data'].forEach(d => {
        this.dataSelectItem.push({"id":d.id,"text":d.nama});
      });

    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  changeStatus(status) {
    this.status = status;
    this.rerender();

  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload(null, false);
      setTimeout(() => {
        //this.dtTrigger.next();

        if (this.pksKontrak.length > 0) {
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
  viewSlip(id) {
    var mediaType = 'application/pdf';
    this.pksKontrakService.getPdfSlip(id).subscribe(
      (res) => {
        // // console.log(res);
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
        // var blob = new Blob([res], { type: mediaType });
        // saveAs(blob, 'report.pdf');
      }
    );
  }

  add() {
    let modalConfig = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true,
      size: 'lg',
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
      that.pksKontrakService.delete(id).subscribe(data => {
        // let t = $('#datatables').DataTable().ajax.reload();
        // t.draw();
        that.rerender();

      });


    });

  }

  edit(id: number) {
    let that = this;
    let pksKontrak;
    this.pksKontrakService.getById(id).subscribe(data => {
      pksKontrak = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        size: 'lg',
        class: "modal-lg ",
        initialState: {
          pksKontrak: pksKontrak
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
      that.pksKontrakService.posting(id, data).subscribe(data => {

        if (data['status'] == 'OK') {
          that.rerender();
          swal({
            title: 'Info!',
            text: 'Posting berhasil.',
            type: 'success',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          })
        } else {

          swal({
            title: 'Perhatian!',
            text:'Posting gagal:' + data['data'],
            type: 'warning',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          })

        }
      });

    });

  }


  onChangeStatus() {
    console.log(this.status_update);

  }


}
