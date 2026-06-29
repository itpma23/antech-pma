import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';


import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { GbmBlokService } from 'src/app/shared/services/gbm_blok.service';
import { GbmBlok } from 'src/app/shared/models/gbm_blok.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { EstBibitService } from 'src/app/shared/services/est_bibit.service';
declare var $: any;
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'edit-cmp',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.css'],
})

export class EditComponent implements OnInit, AfterViewInit {
  isFormSubmitted = false;
  isChangePhoto = false;
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
  GbmBlok: GbmBlok;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private GbmBlokService: GbmBlokService,
    private estBibitService: EstBibitService,
    private authenticationService: AuthenticationService,
    private GbmOrganisasiService: GbmOrganisasiService,
  ) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;
    this.entryForm = this.builder.group({
      organisasi_id: new FormControl([], Validators.required),
      tahuntanam: new FormControl('', Validators.required),
      tipe: new FormControl([], Validators.required),
      topografi: new FormControl([], Validators.required),
      bibit: new FormControl([], Validators.required),
      klasifikasi: new FormControl([], Validators.required),
      intiplasma: new FormControl('1', Validators.required),
      areaproduktif: new FormControl('0', Validators.required),
      areanonproduktif: new FormControl('0', Validators.required),
      jumlahpokok: new FormControl('0', Validators.required),
      kelaspohon: new FormControl('', Validators.required), //
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


    console.log(this.GbmBlok);
    this.entryForm.controls['jumlahpokok'].patchValue(this.GbmBlok.jumlahpokok);
    this.entryForm.controls['areaproduktif'].patchValue(this.GbmBlok.luasareaproduktif);
    this.entryForm.controls['areanonproduktif'].patchValue(this.GbmBlok.luasareanonproduktif);
    this.entryForm.controls['tahuntanam'].patchValue(this.GbmBlok.tahuntanam);
    this.entryForm.controls['intiplasma'].patchValue(this.GbmBlok.intiplasma);
    this.entryForm.controls['kelaspohon'].patchValue(this.GbmBlok.kelaspohon);
    this.entryForm.controls['tahunmulaipanen'].patchValue(this.GbmBlok.tahunmulaipanen);
    this.entryForm.controls['bulanmulaipanen'].patchValue(this.GbmBlok.bulanmulaipanen);
    this.entryForm.controls['kodetanah'].patchValue(this.GbmBlok.kodetanah);
    this.entryForm.controls['tanggaltransaksi'].patchValue(this.GbmBlok.tanggaltransaksi);
    this.entryForm.controls['tanggalpengakuan'].patchValue(this.GbmBlok.tanggalpengakuan);
    this.entryForm.controls['basiskg'].patchValue(this.GbmBlok.basiskg);
    this.entryForm.controls['periodetm'].patchValue(this.GbmBlok.periodetm);
    this.entryForm.controls['cadangan'].patchValue(this.GbmBlok.cadangan);
    this.entryForm.controls['okupasi'].patchValue(this.GbmBlok.okupasi);
    this.entryForm.controls['rendahan'].patchValue(this.GbmBlok.rendahan);
    this.entryForm.controls['sungai'].patchValue(this.GbmBlok.sungai);
    this.entryForm.controls['rumah'].patchValue(this.GbmBlok.rumah);
    this.entryForm.controls['kantor'].patchValue(this.GbmBlok.kantor);
    this.entryForm.controls['pabrik'].patchValue(this.GbmBlok.pabrik);
    this.entryForm.controls['jalan'].patchValue(this.GbmBlok.jalan);
    this.entryForm.controls['kolam'].patchValue(this.GbmBlok.kolam);
    this.entryForm.controls['umum'].patchValue(this.GbmBlok.umum);
    this.entryForm.controls['lc'].patchValue(this.GbmBlok.lc);


  }

  private loadSelect2(): void {


    this.dataSelectTipe = [
      { id: 'BBT', text: 'BIBITAN' },
      { id: 'LC', text: 'PENYIAPAN LAHAN' },
      { id: 'TB', text: 'TANAMAN BARU' },
      { id: 'TBM', text: 'TANAMAN BELUM MENGHASILKAN' },
      { id: 'TM', text: 'TANAMAN MENGHASILKAN' }
    ];
    let selectTipe;
    this.dataSelectTipe.forEach(a=>{
      if(a.id==this.GbmBlok.statusblok){
        selectTipe=a;
      }
    });
    this.entryForm.controls['tipe'].patchValue(selectTipe);
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
    let selectKlasifikasi;
    this.dataSelectKlasifikasi.forEach(a=>{
      if(a.id==this.GbmBlok.klasifikasitanah){
        selectKlasifikasi=a;
      }
    });
    this.entryForm.controls['klasifikasi'].patchValue(selectKlasifikasi);

    this.dataSelectTopografi = [
      { id: 'DATAR', text: 'DATAR' },
      { id: 'BERGELOMBANG', text: 'BERGELOMBANG' },
      { id: 'BERBUKIT', text: 'BERBUKIT' },

    ];

    let selectTopografi;
    this.dataSelectTopografi.forEach(a=>{
      if(a.id==this.GbmBlok.topografi){
        selectTopografi=a;
      }
    });
    this.entryForm.controls['topografi'].patchValue(selectTopografi);


    let selectOrg;
    this.GbmOrganisasiService.getAllByType('BLOK').subscribe(x => {

      this.dataSelectOrganisasi = [];
      x.forEach(d => {
        this.dataSelectOrganisasi.push({"id":d.id,"text":d.kode+' - '+ d.nama});
      });

      this.dataSelectOrganisasi.forEach(a => {
        if (a.id == this.GbmBlok.organisasi_id) {
          selectOrg = a;
        }

      });
      this.entryForm.controls['organisasi_id'].patchValue(selectOrg);
    });

    let selectBibit;
    this.estBibitService.getAll().subscribe(x => {

      this.dataSelectBibit = [];
      x['data'].forEach(d => {
        this.dataSelectBibit.push({ "id": d.id, "text": d.bibit });
      });

      this.dataSelectBibit.forEach(a => {
        if (a.id == this.GbmBlok.jenisbibit) {
          selectBibit = a;
        }

      });
      this.entryForm.controls['bibit'].patchValue(selectBibit);

    });

  }
  onSubmit() {
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    // let frmData=new FormData();
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

    this.GbmBlokService.update(this.GbmBlok.id, dataSubmit).subscribe(data => {

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
  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.entryForm.patchValue({
      img: file
    });
    this.entryForm.get('img').updateValueAndValidity();
    this.isChangePhoto = true;
    console.log(this.isChangePhoto);
  }
}
