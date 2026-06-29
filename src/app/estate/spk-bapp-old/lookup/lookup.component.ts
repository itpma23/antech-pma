import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SERVER_API_URL, SERVER_PATH_URL } from 'src/app/app.constants';

import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PrcPpService } from 'src/app/shared/services/prc_pp.service';
import 'bootstrap-notify';
declare var swal: any;
declare var $: any;

export class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'lookup-cmp',
  templateUrl: 'lookup.component.html'
})

export class LookupComponent implements OnInit {
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
  PrcPp = [];
  PrcPpSelected = [];
  event: EventEmitter<any> = new EventEmitter();
  isChecked = false;
  checkedList: any=[];
  status_update:any="1";
  dbName;
  pathName;
  PATH_URL;
  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private PrcPpService: PrcPpService,
    private bsModalRef: BsModalRef) {
      this.dbName= this.authenticationService.getUserDB();
      this.pathName= this.authenticationService.getUserPath();
      this.PATH_URL=SERVER_PATH_URL;

  }

  ngOnInit() {
    this.loadDatatable();
  }

  loadDatatable() {
    console.log(this.PrcPp);
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,

      //responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Cari",


      },

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

        if (this.PrcPp.length > 0) {
          $('.tfoot_dt').addClass('d-none');
        } else {
          $('.tfoot_dt').removeClass('d-none');
        }
      });
    });
  }

  addItem(item) {
    this.event.emit(item);
    this.bsModalRef.hide();

    // let i = this.PrcPp.indexOf(item);

    // if (i != -1) {
    //   this.PrcPp.splice(i, 1);
    //   this.event.emit(item);

    // }
  }
  addPP(){
    console.log(this.PrcPp);
    this.PrcPpSelected= this.PrcPp.filter(pp=>{return pp.isSelected===true});
    if (this.PrcPpSelected.length==0){
      this.showNotification("top","center","Data Tidak ada ",4)

    }else{
      this.event.emit(this.PrcPpSelected);
      this.bsModalRef.hide();
    }
    console.log(this.PrcPpSelected);
  }
  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, 'PrcPp').subscribe(() => { });
  }

  onClose() {
    this.bsModalRef.hide();

  }
  showNotification(from, align, message, color = 4) {
    var type = ['', 'info', 'success', 'warning', 'danger', 'rose', 'primary'];
    // console.log(type[color]);
    //var color = Math.floor((Math.random() * 6) + 1);

    $.notify({
      icon: "notifications",
      message: message

    }, {
      type: type[color],
      timer: 1000,
      placement: {
        from: from,
        align: align
      }
    });
  }
  checkuncheckall() {
    if (this.isChecked == true) {
      this.isChecked = false;
    }
    else {
      this.isChecked = true;
    }
    for (var i = 0; i < this.PrcPp.length; i++) {
      this.PrcPp[i].isSelected = this.isChecked;
    }
    this.getCheckedItemList();

  }


  // Check All Checkbox Checked
  isAllSelected() {
    this.isChecked = this.PrcPp.every(function (item: any) {
      return item.isSelected == true;
    })
    this.getCheckedItemList();
  }
  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.PrcPp.length; i++) {
      if (this.PrcPp[i].isSelected)
        this.checkedList.push(this.PrcPp[i]);
    }
  //  this.checkedList = JSON.stringify(this.checkedList);
    console.log(this.checkedList);
  }

}
