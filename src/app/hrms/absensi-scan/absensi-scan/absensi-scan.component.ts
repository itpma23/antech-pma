import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SERVER_API_URL, SERVER_FOLDER_NAME, SERVER_PATH_URL } from 'src/app/app.constants';

import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AbsensiService } from 'src/app/shared/services/absensi.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { saveAs } from 'file-saver';
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
  selector: 'absensi-scan-cmp',
  templateUrl: 'absensi-scan.component.html',
  styleUrls: ['absensi-scan.component.css']
})

export class AbsensiScanComponent implements OnInit {
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  isFormSubmitted = false;
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

  bsModalRef: BsModalRef;
  dbName;
  pathName;
  PATH_URL;
  public dataSelectKelas: any[] = [];
  entryForm: FormGroup;



  constructor(private http: HttpClient,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private absensiService: AbsensiService,
    private router: Router, private builder: FormBuilder,)

    {

    this.PATH_URL = SERVER_PATH_URL;
    this.pathName=SERVER_FOLDER_NAME;
    let toDate: Date = new Date();
    this.entryForm = this.builder.group({
      // kelas_id: new FormControl([], Validators.required),
      tgl: new FormControl(toDate, Validators.required),


    });

  }
  get userControl() { return this.entryForm.controls; }
  ngOnInit() {
    // this.loadDatatable();
    this.loadSelect2();
    this.loadDatatable();


  }
  private loadSelect2(): void {


    // this.KelasService.getAllChild().subscribe(x => {
    //   // console.log(x);
    //   // let a = x['data'];
    //   this.dataSelectKelas = [];
    //   x.forEach(d => {
    //     this.dataSelectKelas.push({ "id": d.id, "text": d.nama });

    //   });
    //   this.Kelas = {};
    // });
  }

  loadDatatable() {
    this.dtOptions = {
      paging: false,
      search: false,
      searching: false
      //pagingType: 'full_numbers',
      //pageLength: 2
    };
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
    this.exportAsService.save(this.exportAsConfig, 'absen').subscribe(() => { });
  }

  onSubmit() {
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    let tanggal = formatDate(this.entryForm.get('tgl').value, "yyyy-MM-dd", 'en_US');
    // let kelas_id = this.entryForm.get('kelas_id').value['id'];

    this.absensiService.getAbsensiScan(tanggal).subscribe(
      d => {
        this.absensi = d['data'];
        this.rerender();

      }
    )

  }


  exportXLS() {
    let tanggal = formatDate(this.entryForm.get('tgl').value, "yyyy-MM-dd", 'en_US');
    let kelas_id = this.entryForm.get('kelas_id').value['id'];


    var mediaType = 'application/pdf';
    this.absensiService.getAbsensiQrCodeSiswaXLS(tanggal, kelas_id).subscribe(
      (response: any) => {
        // console.log(res);
        // var fileURL = URL.createObjectURL(res);
        // window.open(fileURL);
        let blob = new Blob([response], {type: 'application/vnd.ms-excel'})
        saveAs(blob, 'absensi_karyawan.xls')
      }
    );

  }

}
