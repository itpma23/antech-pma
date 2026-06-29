import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { GbmBlokService } from 'src/app/shared/services/gbm_blok.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { EstBibitService } from 'src/app/shared/services/est_bibit.service';
import { GbmBlok } from 'src/app/shared/models/gbm_blok.model';
import { formatDate } from '@angular/common';

declare var $: any;
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'add-cmp',
  templateUrl: 'add.component.html',
  styleUrls: ['add.component.css'],
})

export class AddComponent implements OnInit, AfterViewInit {
  isFormSubmitted = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();

  public dataSelectTipe: any[] = [];
  public dataSelectOrganisasi: any[] = [];
  public dataSelectBibit: any[] = [];
  public dataSelectTopografi: any[] = [];
  public dataSelectKlasifikasi: any[] = [];

  public options: any;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private GbmBlokService: GbmBlokService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private estBibitService: EstBibitService,



  ) {
    this.entryForm = this.builder.group({
      organisasi_id: new FormControl([], Validators.required),
      tahuntanam: new FormControl('', Validators.required),
      tipe: new FormControl([], Validators.required),
      topografi: new FormControl([], Validators.required),
      bibit: new FormControl([], Validators.required),
      klasifikasi: new FormControl([], Validators.required),
      intiplasma: new FormControl('I', Validators.required),
      areaproduktif: new FormControl('0', Validators.required),
      areanonproduktif: new FormControl('0', Validators.required),
      jumlahpokok: new FormControl('0', Validators.required),
      kelaspohon: new FormControl('', Validators.required), // 🚨 wajib
      tahunmulaipanen: new FormControl(0), // default 0
      bulanmulaipanen: new FormControl(0), // default 0
      kodetanah: new FormControl(null), // nullable
      tanggaltransaksi: new FormControl(null), // nullable
      tanggalpengakuan: new FormControl(null), // nullable
      basiskg: new FormControl(0), // default 0
      periodetm: new FormControl(null), // char(7), nullable
      cadangan: new FormControl(0),
      okupasi: new FormControl(0),
      rendahan: new FormControl(0),
      sungai: new FormControl(0),
      rumah: new FormControl(0),
      kantor: new FormControl(0),
      pabrik: new FormControl(0),
      jalan: new FormControl(0),
      kolam: new FormControl(0),
      umum: new FormControl(0),
      lc: new FormControl(0),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }


  private loadSelect2(): void {



    this.dataSelectTipe = [
      { id: 'BBT', text: 'BIBITAN' },
      { id: 'LC', text: 'PENYIAPAN LAHAN' },
      { id: 'TB', text: 'TANAMAN BARU' },
      { id: 'TBM', text: 'TANAMAN BELUM MENGHASILKAN' },
      { id: 'TM', text: 'TANAMAN MENGHASILKAN' }

    ];
    this.dataSelectKlasifikasi = [
      { id: 'S1', text: 'S1' },
      { id: 'S2', text: 'S2' },
      { id: 'S3', text: 'S3' },
      { id: 'S4', text: 'S4' }

    ];
    this.dataSelectTopografi = [
      { id: 'DATAR', text: 'DATAR' },
      { id: 'BERGELOMBANG', text: 'BERGELOMBANG' },
      { id: 'BERBUKIT', text: 'BERBUKIT' },

    ];



    this.GbmOrganisasiService.getAllByType('BLOK').subscribe(x => {
      console.log(x);
      this.dataSelectOrganisasi = [];
      x.forEach(d => {
        this.dataSelectOrganisasi.push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
      });

    });
    this.estBibitService.getAll().subscribe(x => {
      console.log(x);
      this.dataSelectBibit = [];
      x['data'].forEach(d => {
        this.dataSelectBibit.push({ "id": d.id, "text": d.bibit });
      });

    });

  }
  onSubmit() {
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    let dataSubmit: GbmBlok = {
      'organisasi_id': this.entryForm.get('organisasi_id').value.id,
      'tahuntanam': this.entryForm.get('tahuntanam').value,
      'luasareaproduktif': this.entryForm.get('areaproduktif').value,
      'luasareanonproduktif': this.entryForm.get('areanonproduktif').value,
      'jumlahpokok': this.entryForm.get('jumlahpokok').value,
      'topografi': this.entryForm.get('topografi').value.id,
      'klasifikasitanah': this.entryForm.get('klasifikasi').value.id,
      'jenisbibit': this.entryForm.get('bibit').value.id,
      'intiplasma': this.entryForm.get('intiplasma').value,
      'statusblok': this.entryForm.get('tipe').value.id,
      'kelaspohon': this.entryForm.get('kelaspohon').value,
      'tahunmulaipanen': this.entryForm.get('tahunmulaipanen').value,
      'bulanmulaipanen': this.entryForm.get('bulanmulaipanen').value,
      'kodetanah': this.entryForm.get('kodetanah').value,
      'tanggaltransaksi': this.entryForm.get('tanggaltransaksi').value,
      'tanggalpengakuan': this.entryForm.get('tanggalpengakuan').value,
      'basiskg': this.entryForm.get('basiskg').value,
      'periodetm': this.entryForm.get('periodetm').value,
      'cadangan': this.entryForm.get('cadangan').value,
      'okupasi': this.entryForm.get('okupasi').value,
      'rendahan': this.entryForm.get('rendahan').value,
      'sungai': this.entryForm.get('sungai').value,
      'rumah': this.entryForm.get('rumah').value,
      'kantor': this.entryForm.get('kantor').value,
      'pabrik': this.entryForm.get('pabrik').value,
      'jalan': this.entryForm.get('jalan').value,
      'kolam': this.entryForm.get('kolam').value,
      'umum': this.entryForm.get('umum').value,
      'lc': this.entryForm.get('lc').value
    };



    this.GbmBlokService.create(dataSubmit).subscribe(data => {
      // console.log(data);
      if (data['status'] == 'OK') {
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
      } else {
        swal({
          title: 'Perhatian!',
          text: 'Proses Simpan Gagal',
          type: 'warning',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
      }
    });
  }

  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.entryForm.patchValue({
      img: file
    });
    this.entryForm.get('img').updateValueAndValidity()
    console.log(file);
  }
  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {

    this.loadSelect2();

  }
  valueChange($event) {
    console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
}
