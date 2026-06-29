import { Component, EventEmitter, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { BsModalRef } from "ngx-bootstrap/modal";
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

import { AuthenticationService } from '../../../shared/services/authentication.service';
import { AccPermohonanBayarV2Service } from 'src/app/shared/services/acc_permohonan_bayar_v2.service';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'lookup-permohonan-pembayaran-cmp',
  templateUrl: 'lookup-permohonan-pembayaran.component.html'
})

export class LookupPermohonanComponent implements OnInit, AfterViewInit, OnDestroy {

  dtOptions: any;

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject();

  event: EventEmitter<any> = new EventEmitter();

  supplier_id: number;

  permohonanList = [];

  constructor(
    private bsModalRef: BsModalRef,
    private authenticationService: AuthenticationService,
    private accPermohonanService: AccPermohonanBayarV2Service
  ) { }

  ngOnInit() {

    this.loadDatatable();

    this.loadData();

  }

  loadDatatable() {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Cari Permohonan"
      }
    };

  }

  loadData() {

    if (!this.supplier_id) return;

    this.accPermohonanService
      .getAllBySupplier(this.supplier_id)
      .subscribe(res => {

        this.permohonanList = res['data'];

        this.dtTrigger.next();

      });

  }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {

    this.dtTrigger.unsubscribe();

  }

  pilihItem(item) {

    this.event.emit(item);

    this.bsModalRef.hide();

  }

  onClose() {

    this.bsModalRef.hide();

  }

}