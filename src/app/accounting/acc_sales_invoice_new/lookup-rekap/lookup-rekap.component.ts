import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from "ngx-bootstrap/modal";
import { SERVER_API_URL, SERVER_PATH_URL } from 'src/app/app.constants';
import { DataTableDirective } from 'angular-datatables';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import 'bootstrap-notify';

declare var $: any;

export class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  moduleId: module.id,
  selector: 'lookup-rekap-cmp',
  templateUrl: 'lookup-rekap.component.html'
})

export class LookupRekapComponent implements OnInit {
  dtOptions: any;
  private apiUrl = SERVER_API_URL;

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();

  SlsRekap = [];
  selectedRekap: any[] = [];

  event: EventEmitter<any> = new EventEmitter();

  customer_id;
  dbName;
  pathName;
  PATH_URL;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private bsModalRef: BsModalRef
  ) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;
  }

  ngOnInit() {
    this.loadDatatable();
  }

  loadDatatable() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      autoWidth: false,

      order: [[0, 'desc']],   // kolom no_rekap (index ke-2)
      columnDefs: [
        { orderable: false, targets: [0, 1] }, // kolom id + checkbox
        { visible: false, targets: [0] },     // kolom id disembunyikan
        { className: "text-center", targets: [1, 3] },
        { className: "text-right", targets: [4, 5, 6] }
      ],

      language: {
        search: "_INPUT_",
        searchPlaceholder: "Cari No Rekap / SPK",
      },

      columns: [
        { data: 'id', visible: false },
        {
          data: null,
          orderable: false,
          render: (data, type, row) =>
            `<input type="checkbox" class="rekap-check" value="${row.id}">`
        },
        { data: 'no_rekap' },
        { data: 'spk' },
        { data: 'tanggal' },
        { data: 'qty' },
        { data: 'harga' },
        { data: 'total' },
      ],

      ajax: (params, callback) => {
        this.http.post<DataTablesResponse>(
          `${this.apiUrl}/SlsRekap/listRekapforInvoice/${this.customer_id}`, params
        ).subscribe(resp => {

          this.SlsRekap = resp.data;
          console.log("Rekap Data:", this.SlsRekap);

          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: resp.data
          });
        });
      }
    };
  }


  ngAfterViewInit(): void {
    this.dtTrigger.next();

    // Checkbox handler
    $(document).on('change', '.rekap-check', (event) => {
      const id = $(event.target).val();
      const row = this.SlsRekap.find(r => r.id == id);

      if ((event.target as HTMLInputElement).checked) {
        if (!this.selectedRekap.find(x => x.id == row.id)) {
          this.selectedRekap.push(row);
        }
      } else {
        this.selectedRekap = this.selectedRekap.filter(x => x.id != row.id);
      }

      console.log("Selected Rekap:", this.selectedRekap);
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload(null, false);
      this.dtTrigger.next();
    });
  }

  submitSelected() {
    this.event.emit(this.selectedRekap);
    this.bsModalRef.hide();
  }

  onClose() {
    this.bsModalRef.hide();
  }

}
