import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SERVER_API_URL } from 'src/app/app.constants';
import { AddComponent } from '../add/add.component';
import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EditComponent } from '../edit/edit.component';
import { PrcQuotationService } from 'src/app/shared/services/prc_quotation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileSaverService } from 'ngx-filesaver';
// import * as $ from "jquery";
// require('sweetalert2');
declare var swal: any;

export class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
declare var $: any;
;
@Component({
  moduleId: module.id,
  selector: 'detail-cmp',
  templateUrl: 'detail.component.html',
  styleUrls: ['detail.component.css'],
})

export class DetailComponent implements OnInit {
  player: YT.Player;
  youtubeId = '';
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
  quotation;
  quotation_id;
  lastUrl;

  postList: any[] = [];
  bsModalRef: BsModalRef;
  siswa;
  constructor(private http: HttpClient,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private prcQuotationService: PrcQuotationService, private router: Router,
    private route: ActivatedRoute,
    private _httpClient: HttpClient,
    private _FileSaverService: FileSaverService,) {
    this.quotation_id = this.route.snapshot.params.quotation_id
    this.lastUrl = this.route.snapshot.paramMap.get('previousUrl');

  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.prcQuotationService.getDetail(this.quotation_id).subscribe(m => {
      this.quotation = m['data'];
      console.log(this.quotation);
    })


  }
  savePlayer(player) {
    this.player = player;
    console.log('player instance', player);
  }
  onStateChange(event) {
    console.log('player state', event.data);
  }
  youTubeGetID(url) {
    var ID = '';
    url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
      ID = url[2].split(/[^0-9a-z_\-]/i);
      ID = ID[0];
    }
    else {
      ID = url;
    }
    return ID;
  }
  ngAfterViewInit(): void {

  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload(null, false);
      setTimeout(() => {
        //this.dtTrigger.next();

        if (this.quotation.length > 0) {
          $('.tfoot_dt').addClass('d-none');
        } else {
          $('.tfoot_dt').removeClass('d-none');
        }
      });
    });
  }

  kembali() {
    this.router.navigate([this.lastUrl]);

  }
  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, 'quotation').subscribe(() => { });
  }
  download(id, filename) {
    this.prcQuotationService.download(id, filename);
  }


  add(type: String) {
    let modalConfig = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true,
      //size: 'lg',
      class: "modal-lg ",
      initialState: {
        type_id: type,
      }

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
      that.prcQuotationService.delete(id).subscribe(data => {
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

  edit(id: number) {
    let that = this;
    let quotation;
    this.prcQuotationService.getById(id).subscribe(data => {
      quotation = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        class: "modal-lg ",
        initialState: {
          quotation: quotation,
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
}
