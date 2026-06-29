import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { PksLhpService } from 'src/app/shared/services/pks_lhp.service';
import { Pengajar } from 'src/app/shared/models/pengajar.model';
import { formatDate, formatNumber } from '@angular/common';
import * as QuillNamespace from 'quill';
let Quill: any = QuillNamespace;
import ImageResize from 'quill-image-resize-module';
import { TranslateService } from '@ngx-translate/core';
import { PksLhp } from 'src/app/shared/models/pks_lhp.model';
import { isNullOrUndefined, isNumber, isString } from 'util';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service'
import { PksProduksiHarianService } from 'src/app/shared/services/pks_produksi_harian.service';

Quill.register('modules/imageResize', ImageResize);

// (global):variable
declare var $: any;
declare var swal: any;

// interface
interface Tipe {
  value: string;
  viewValue: string;
}

// component
@Component({
  moduleId: module.id,
  selector: 'add-cmp',
  templateUrl: 'add.component.html',
  styleUrls: ['add.component.css'],
})

// class component
export class AddComponent implements OnInit, AfterViewInit {

  // class(global):variable
  editor_modules: any;
  isFormSubmitted = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  entryForm: FormGroup;
  categories: any[] = [];
  event: EventEmitter<any> = new EventEmitter();
  tipes: Tipe[] = [
    { value: '0', viewValue: 'KAS' },
    { value: '1', viewValue: 'Bank' },
    { value: '2', viewValue: 'Piutang' }
  ];
  // class:method constructor
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private pksLhpService: PksLhpService,
    private translate: TranslateService,
    private pksProduksiHarianService:PksLhpService,
    private GbmOrganisasiService:GbmOrganisasiService,
  ) {
    let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      tanggal: new FormControl(toDate, Validators.required),
      mill_id: new FormControl([], Validators.required),
      satu_inti_hi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      satu_inti_sdhi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      satu_inti_sdbi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      satu_plasma_hi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      satu_plasma_sdhi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      satu_plasma_sdbi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      satu_p3expt_hi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      satu_p3expt_sdhi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      satu_p3expt_sdbi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      satu_p3experson_hi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      satu_p3experson_sdhi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      satu_p3experson_sdbi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      satu_total_hi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      satu_total_sdhi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      satu_total_sdbi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),

      dua_hi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      dua_sdhi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      dua_sdbi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      dua_restan: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),

      tiga_hi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      tiga_sdhi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      tiga_sdbi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      tiga_rendemen_hi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      tiga_rendemen_sdhi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      tiga_rendemen_sdbi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      tiga_ffa: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      tiga_kadar_air: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      tiga_kadar_kotoran: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),

      empat_tank1_kg: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      empat_tank1_ffa: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      empat_tank1_kadar_air: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      empat_tank1_kadar_kotoran: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      empat_tank1_dobi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      empat_tank2_kg: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      empat_tank2_ffa: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      empat_tank2_kadar_air: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      empat_tank2_kadar_kotoran: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      empat_tank2_dobi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      empat_tank3_kg: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      empat_tank3_ffa: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      empat_tank3_kadar_air: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      empat_tank3_kadar_kotoran: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      empat_tank3_dobi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      empat_total: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),

      lima_kg: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      lima_ffa: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      lima_kadar_air: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      lima_kadar_kotoran: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),

      enam_hi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      enam_sdhi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      enam_sdbi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),

      tujuh_hi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      tujuh_sdhi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      tujuh_sdbi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),

      delapan_hi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      delapan_sdhi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      delapan_sdbi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      delapan_rendemen_hi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      delapan_rendemen_sdhi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      delapan_rendemen_sdbi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      delapan_ffa_hi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      delapan_kadar_air_hi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      delapan_kadar_kotoran_hi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),

      sembilan_hi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      sembilan_sdhi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      sembilan_sdbi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),

      sepuluh_hi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      sepuluh_sdhi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      sepuluh_sdbi: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),

      sebelas_oil_press: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      sebelas_oil_nut: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      sebelas_oil_e_bunch: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      sebelas_oil_final_effluent: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      sebelas_oil_fruit_loss: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      sebelas_oil_total: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),

      sebelas_kernel_fruit_loss: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      sebelas_kernel_fibre_cyclone: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      sebelas_kernel_ltds_1: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      sebelas_kernel_ltds_2: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      sebelas_kernel_claybath: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),
      sebelas_kernel_total: new FormControl(formatNumber(0, 'en_US', '1.2-2'), Validators.required),

      duabelas_ket: new FormControl(null, Validators.required),

    });
  }


  get userControl() { return this.entryForm.controls; }

  // class:method initialize after view
  ngAfterViewInit(): void {
    this.loadSelect2();
  }

  // class(public):variable
  public dataSelect: any[] = [];
  public options: any;
  public dataSelectMill: any[] = [];

  // class(private): {select2}
  private loadSelect2(): void {

    this.GbmOrganisasiService.getAllByType('MILL').subscribe(x=>{

      this.dataSelectMill=[];
      x.forEach(d => {
        this.dataSelectMill.push({"id":d.id,"text":d.nama});
      });
      console.log(x);

    });

    this.dataSelect = [
      { id: 'Laki-laki', text: 'Laki-laki' },
      { id: 'Perempuan', text: 'Perempuan' },
    ];
    this.dataSelect.unshift({ id: -1, text: 'Pilih' });
  }
  // class:method trigger on submitted form
  onSubmit() {
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    let frmData = new FormData();

    let dataSubmit = this.entryForm.value;
    dataSubmit['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');
    dataSubmit['mill_id']=this.entryForm.get('mill_id').value.id;

    dataSubmit['satu_inti_hi'] = parseFloat(this.entryForm.get('satu_inti_hi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['satu_inti_sdhi'] = parseFloat(this.entryForm.get('satu_inti_sdhi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['satu_inti_sdbi'] = parseFloat(this.entryForm.get('satu_inti_sdbi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['satu_plasma_hi'] = parseFloat(this.entryForm.get('satu_plasma_hi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['satu_plasma_sdhi'] = parseFloat(this.entryForm.get('satu_plasma_sdhi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['satu_plasma_sdbi'] = parseFloat(this.entryForm.get('satu_plasma_sdbi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['satu_p3expt_hi'] = parseFloat(this.entryForm.get('satu_p3expt_hi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['satu_p3expt_sdhi'] = parseFloat(this.entryForm.get('satu_p3expt_sdhi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['satu_p3expt_sdbi'] = parseFloat(this.entryForm.get('satu_p3expt_sdbi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['satu_p3experson_hi'] = parseFloat(this.entryForm.get('satu_p3experson_hi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['satu_p3experson_sdhi'] = parseFloat(this.entryForm.get('satu_p3experson_sdhi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['satu_p3experson_sdbi'] = parseFloat(this.entryForm.get('satu_p3experson_sdbi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['satu_total_hi'] = parseFloat(this.entryForm.get('satu_total_hi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['satu_total_sdhi'] = parseFloat(this.entryForm.get('satu_total_sdhi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['satu_total_sdbi'] = parseFloat(this.entryForm.get('satu_total_sdbi').value.replace(/[^\d\.\-]/g, ""));

    dataSubmit['dua_hi'] = parseFloat(this.entryForm.get('dua_hi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['dua_sdhi'] = parseFloat(this.entryForm.get('dua_sdhi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['dua_sdbi'] = parseFloat(this.entryForm.get('dua_sdbi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['dua_restan'] = parseFloat(this.entryForm.get('dua_restan').value.replace(/[^\d\.\-]/g, ""));

    dataSubmit['tiga_hi'] = parseFloat(this.entryForm.get('tiga_hi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['tiga_sdhi'] = parseFloat(this.entryForm.get('tiga_sdhi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['tiga_sdbi'] = parseFloat(this.entryForm.get('tiga_sdbi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['tiga_rendemen_hi'] = parseFloat(this.entryForm.get('tiga_rendemen_hi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['tiga_rendemen_sdhi'] = parseFloat(this.entryForm.get('tiga_rendemen_sdhi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['tiga_rendemen_sdbi'] = parseFloat(this.entryForm.get('tiga_rendemen_sdbi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['tiga_ffa'] = parseFloat(this.entryForm.get('tiga_ffa').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['tiga_kadar_air'] = parseFloat(this.entryForm.get('tiga_kadar_air').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['tiga_kadar_kotoran'] = parseFloat(this.entryForm.get('tiga_kadar_kotoran').value.replace(/[^\d\.\-]/g, ""));

    dataSubmit['empat_tank1_kg'] = parseFloat(this.entryForm.get('empat_tank1_kg').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['empat_tank1_ffa'] = parseFloat(this.entryForm.get('empat_tank1_ffa').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['empat_tank1_kadar_air'] = parseFloat(this.entryForm.get('empat_tank1_kadar_air').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['empat_tank1_kadar_kotoran'] = parseFloat(this.entryForm.get('empat_tank1_kadar_kotoran').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['empat_tank1_dobi'] = parseFloat(this.entryForm.get('empat_tank1_dobi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['empat_tank2_kg'] = parseFloat(this.entryForm.get('empat_tank2_kg').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['empat_tank2_ffa'] = parseFloat(this.entryForm.get('empat_tank2_ffa').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['empat_tank2_kadar_air'] = parseFloat(this.entryForm.get('empat_tank2_kadar_air').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['empat_tank2_kadar_kotoran'] = parseFloat(this.entryForm.get('empat_tank2_kadar_kotoran').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['empat_tank2_dobi'] = parseFloat(this.entryForm.get('empat_tank2_dobi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['empat_tank3_kg'] = parseFloat(this.entryForm.get('empat_tank3_kg').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['empat_tank3_ffa'] = parseFloat(this.entryForm.get('empat_tank3_ffa').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['empat_tank3_kadar_air'] = parseFloat(this.entryForm.get('empat_tank3_kadar_air').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['empat_tank3_kadar_kotoran'] = parseFloat(this.entryForm.get('empat_tank3_kadar_kotoran').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['empat_tank3_dobi'] = parseFloat(this.entryForm.get('empat_tank3_dobi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['empat_total'] = parseFloat(this.entryForm.get('empat_total').value.replace(/[^\d\.\-]/g, ""));

    dataSubmit['lima_kg'] = parseFloat(this.entryForm.get('lima_kg').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['lima_ffa'] = parseFloat(this.entryForm.get('lima_ffa').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['lima_kadar_air'] = parseFloat(this.entryForm.get('lima_kadar_air').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['lima_kadar_kotoran'] = parseFloat(this.entryForm.get('lima_kadar_kotoran').value.replace(/[^\d\.\-]/g, ""));

    dataSubmit['enam_hi'] = parseFloat(this.entryForm.get('enam_hi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['enam_sdhi'] = parseFloat(this.entryForm.get('enam_sdhi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['enam_sdbi'] = parseFloat(this.entryForm.get('enam_sdbi').value.replace(/[^\d\.\-]/g, ""));

    dataSubmit['tujuh_hi'] = parseFloat(this.entryForm.get('tujuh_hi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['tujuh_sdhi'] = parseFloat(this.entryForm.get('tujuh_sdhi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['tujuh_sdbi'] = parseFloat(this.entryForm.get('tujuh_sdbi').value.replace(/[^\d\.\-]/g, ""));

    dataSubmit['delapan_hi'] = parseFloat(this.entryForm.get('delapan_hi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['delapan_sdhi'] = parseFloat(this.entryForm.get('delapan_sdhi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['delapan_sdbi'] = parseFloat(this.entryForm.get('delapan_sdbi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['delapan_rendemen_hi'] = parseFloat(this.entryForm.get('delapan_rendemen_hi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['delapan_rendemen_sdhi'] = parseFloat(this.entryForm.get('delapan_rendemen_sdhi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['delapan_rendemen_sdbi'] = parseFloat(this.entryForm.get('delapan_rendemen_sdbi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['delapan_ffa_hi'] = parseFloat(this.entryForm.get('delapan_ffa_hi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['delapan_kadar_air_hi'] = parseFloat(this.entryForm.get('delapan_kadar_air_hi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['delapan_kadar_kotoran_hi'] = parseFloat(this.entryForm.get('delapan_kadar_kotoran_hi').value.replace(/[^\d\.\-]/g, ""));

    dataSubmit['sembilan_hi'] = parseFloat(this.entryForm.get('sembilan_hi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['sembilan_sdhi'] = parseFloat(this.entryForm.get('sembilan_sdhi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['sembilan_sdbi'] = parseFloat(this.entryForm.get('sembilan_sdbi').value.replace(/[^\d\.\-]/g, ""));

    dataSubmit['sepuluh_hi'] = parseFloat(this.entryForm.get('sepuluh_hi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['sepuluh_sdhi'] = parseFloat(this.entryForm.get('sepuluh_sdhi').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['sepuluh_sdbi'] = parseFloat(this.entryForm.get('sepuluh_sdbi').value.replace(/[^\d\.\-]/g, ""));

    dataSubmit['sebelas_oil_press'] = parseFloat(this.entryForm.get('sebelas_oil_press').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['sebelas_oil_nut'] = parseFloat(this.entryForm.get('sebelas_oil_nut').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['sebelas_oil_e_bunch'] = parseFloat(this.entryForm.get('sebelas_oil_e_bunch').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['sebelas_oil_final_effluent'] = parseFloat(this.entryForm.get('sebelas_oil_final_effluent').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['sebelas_oil_fruit_loss'] = parseFloat(this.entryForm.get('sebelas_oil_fruit_loss').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['sebelas_oil_total'] = parseFloat(this.entryForm.get('sebelas_oil_total').value.replace(/[^\d\.\-]/g, ""));

    dataSubmit['sebelas_kernel_fruit_loss'] = parseFloat(this.entryForm.get('sebelas_kernel_fruit_loss').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['sebelas_kernel_fibre_cyclone'] = parseFloat(this.entryForm.get('sebelas_kernel_fibre_cyclone').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['sebelas_kernel_ltds_1'] = parseFloat(this.entryForm.get('sebelas_kernel_ltds_1').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['sebelas_kernel_ltds_2'] = parseFloat(this.entryForm.get('sebelas_kernel_ltds_2').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['sebelas_kernel_claybath'] = parseFloat(this.entryForm.get('sebelas_kernel_claybath').value.replace(/[^\d\.\-]/g, ""));
    dataSubmit['sebelas_kernel_total'] = parseFloat(this.entryForm.get('sebelas_kernel_total').value.replace(/[^\d\.\-]/g, ""));

    // console.log(dataSubmit);
    this.pksLhpService.create(dataSubmit).subscribe(data => {
      if( data['status']=='OK'){
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Simpan berhasil',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })

        this.event.emit('OK');
        this.bsModalRef.hide();
      }else{
        swal({
          title: 'Perhatian!',
          text: 'Proses Simpan Gagal' ,
          type: 'warning',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
      }
    });
  }

  // class:method upload
  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.entryForm.patchValue({
      img: file
    });
    this.entryForm.get('img').updateValueAndValidity()
    console.log(file);
  }

  // class:method trigger on close
  onClose() {
    this.bsModalRef.hide();
  }

  // class:method trigger on initialize
  ngOnInit() {
    this.editor_modules = {
      toolbar: {
        container: [
          [{ 'font': [] }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'align': [] }],
          ['link', 'image']
        ]
      },
      imageResize: true
    };
  }

  // class:method valueChange
  valueChange($event) {
    console.log($event);
  }

  formatNumber( event ){
    // console.log(event.srcElement.getAttribute('formControlName'));
    let form = this.entryForm.get(event.srcElement.getAttribute('formControlName'));
    let value = this.entryForm.get(event.srcElement.getAttribute('formControlName')).value;
    if (isString(value)) {
      value = parseFloat(value.replace(/[^\d\.\-]/g, ""));
    }
    form.patchValue(formatNumber(value, 'en_US', '1.2-2'));
  }
  getData() {
    let mill_id=260;//=this.entryForm.get('mill_id').value['id'];

    let tgl = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US'); ''
    let data = { tanggal: tgl, mill_id: mill_id }
    this.pksProduksiHarianService.getProduksiHarian(data).subscribe(d => {
      let res = d['data'];
      console.log(res);
      // this.entryForm.controls['tbs_olah'].patchValue(res['tbs_olah_hari_ini']);
      // this.entryForm.controls['tbs_kemarin'].patchValue(res['tbs_sisa_kemarin']);
      // this.entryForm.controls['tbs_masuk'].patchValue(res['tbs_masuk']);
      // this.entryForm.controls['tbs_sisa'].patchValue(res['tbs_sisa']);
      // this.entryForm.controls['cpo_kg'].patchValue(res['cpo_kg_akhir']);
      // this.entryForm.controls['kernel_kg'].patchValue(res['kernel_kg_akhir']);
      // this.entryForm.controls['kirim_cpo_kg'].patchValue(res['cpo_kg_kirim']);
      // this.entryForm.controls['kirim_kernel_kg'].patchValue(res['kernel_kg_kirim']);
      // this.entryForm.controls['produksi_cpo_kg'].patchValue(res['cpo_kg_olah']);
      // this.entryForm.controls['produksi_kernel_kg'].patchValue(res['kernel_kg_olah']);
      this.entryForm.controls['satu_inti_hi'].patchValue(formatNumber(res['tbs_inti_hari_ini'], 'en_US', '1.2-2'));
      this.entryForm.controls['satu_inti_sdhi'].patchValue(formatNumber(res['tbs_inti_sd_hari_ini'], 'en_US', '1.2-2'));
      this.entryForm.controls['satu_inti_sdbi'].patchValue(formatNumber(res['tbs_inti_sd_bulan_ini'], 'en_US', '1.2-2'));
      this.entryForm.controls['satu_plasma_hi'].patchValue(formatNumber(res['tbs_plasma_hari_ini'], 'en_US', '1.2-2'));
      this.entryForm.controls['satu_plasma_sdhi'].patchValue(formatNumber(res['tbs_plasma_sd_hari_ini'], 'en_US', '1.2-2'));
      this.entryForm.controls['satu_plasma_sdbi'].patchValue(formatNumber(res['tbs_plasma_sd_bulan_ini'], 'en_US', '1.2-2'));
      this.entryForm.controls['satu_p3expt_hi'].patchValue(formatNumber(res['tbs_ext_hari_ini'], 'en_US', '1.2-2'));
      this.entryForm.controls['satu_p3expt_sdhi'].patchValue(formatNumber(res['tbs_ext_sd_hari_ini'], 'en_US', '1.2-2'));
      this.entryForm.controls['satu_p3expt_sdbi'].patchValue(formatNumber(res['tbs_ext_sd_bulan_ini'], 'en_US', '1.2-2'));
      // this.entryForm.controls['satu_p3experson_hi'].patchValue(formatNumber(res['tbs_inti_hari_ini'], 'en_US', '1.2-2'));
      // this.entryForm.controls['satu_p3experson_sdhi'].patchValue(formatNumber(res['tbs_inti_hari_ini'], 'en_US', '1.2-2'));
      // this.entryForm.controls['satu_p3experson_sdbi'].patchValue(formatNumber(res['tbs_inti_hari_ini'], 'en_US', '1.2-2'));
      this.entryForm.controls['satu_total_hi'].patchValue(formatNumber(res['total_tbs_hari_ini'], 'en_US', '1.2-2'));
      this.entryForm.controls['satu_total_sdhi'].patchValue(formatNumber(res['total_tbs_sd_hari_ini'], 'en_US', '1.2-2'));
      this.entryForm.controls['satu_total_sdbi'].patchValue(formatNumber(res['total_tbs_sd_bulan_ini'], 'en_US', '1.2-2'));

      this.entryForm.controls['sembilan_hi'].patchValue(formatNumber(res['cpo_kg_kirim_hari_ini'], 'en_US', '1.2-2'));
      this.entryForm.controls['sembilan_sdhi'].patchValue(formatNumber(res['cpo_kg_kirim_sd_hari_ini'], 'en_US', '1.2-2'));
      this.entryForm.controls['sembilan_sdbi'].patchValue(formatNumber(res['cpo_kg_kirim_sd_bulan_ini'], 'en_US', '1.2-2'));
      this.entryForm.controls['sepuluh_hi'].patchValue(formatNumber(res['kernel_kg_kirim_hari_ini'], 'en_US', '1.2-2'));
      this.entryForm.controls['sepuluh_sdhi'].patchValue(formatNumber(res['kernel_kg_kirim_sd_hari_ini'], 'en_US', '1.2-2'));
      this.entryForm.controls['sepuluh_sdbi'].patchValue(formatNumber(res['kernel_kg_kirim_sd_bulan_ini'], 'en_US', '1.2-2'));
      this.entryForm.controls['dua_hi'].patchValue(formatNumber(res['tbs_olah_hari_ini'], 'en_US', '1.2-2'));
      this.entryForm.controls['dua_sdhi'].patchValue(formatNumber(res['tbs_olah_sd_hari_ini'], 'en_US', '1.2-2'));
      this.entryForm.controls['dua_sdbi'].patchValue(formatNumber(res['tbs_olah_sd_bulan_ini'], 'en_US', '1.2-2'));
      this.entryForm.controls['dua_restan'].patchValue(formatNumber(res['tbs_sisa'], 'en_US', '1.2-2'));


    });


  }

}
