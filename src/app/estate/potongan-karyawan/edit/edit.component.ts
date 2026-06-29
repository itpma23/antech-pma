import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { EstPotonganKaryawan } from 'src/app/shared/models/est_potongan_karyawan.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { AccKegiatanService } from 'src/app/shared/services/acc_kegiatan.service';
import { EstPotonganKaryawanService } from 'src/app/shared/services/est_potongan_karyawan.service';
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
  public dataSelectLokasi: any[] = [];
  public dataSelectAfdeling: any[] = [];
  public dataSelectBlok: any[] = [];
  public dataSelectKaryawan: any[] = [];
  public dataSelectKegiatan: any[] = [];

  estPotonganKaryawan: EstPotonganKaryawan;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private estPotonganKaryawanService: EstPotonganKaryawanService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private KaryawanService:KaryawanService,
    private AccKegiatanService:AccKegiatanService,


  ) {

    let toDate: Date = new Date();
    this.entryForm = this.builder.group({

      lokasi_id: new FormControl([], Validators.required),
      karyawan_id: new FormControl([], Validators.required),
      kegiatan_id: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
      nilai_potongan: new FormControl(0, Validators.required),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    console.log(this.estPotonganKaryawan);

    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.estPotonganKaryawan.tanggal)));
    this.entryForm.controls['nilai_potongan'].patchValue(this.estPotonganKaryawan.nilai_potongan);
    
  }
  private loadSelect2(): void {



    let selectMill;
    this.GbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      // console.log(x);
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
      this.dataSelectLokasi.forEach(a => {
        if (a.id == this.estPotonganKaryawan.lokasi_id) {
          selectMill = a;
        }
      });
      this.entryForm.controls['lokasi_id'].patchValue(selectMill);
    });

    let id_lokasi;
    this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x=>{
      id_lokasi = x.id;
      let selectKaryawan;
      this.KaryawanService.getAll().subscribe(x => {
        // console.log(x);
        this.dataSelectKaryawan = [];
        x['data'].forEach(d => {
          if (id_lokasi == d.lokasi_tugas_id) {
            this.dataSelectKaryawan.push({"id":d.id,"text":"("+d.sub_bagian_nama+") "+d.nip+" - "+d.nama});
          }
        });
        this.dataSelectKaryawan.forEach(a => {
          if (a.id == this.estPotonganKaryawan.karyawan_id) {
            selectKaryawan = a;
          }
        });
        this.entryForm.controls['karyawan_id'].patchValue(selectKaryawan);
      });
    });

    let selectKegiatan;
    this.AccKegiatanService.getAll().subscribe(x => {
      // console.log(x);
      this.dataSelectKegiatan = [];
      x['data'].forEach(d => {
        this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama });
      });
      this.dataSelectKegiatan.forEach(a => {
        if (a.id == this.estPotonganKaryawan.kegiatan_id) {
          selectKegiatan = a;
        }
      });
      this.entryForm.controls['kegiatan_id'].patchValue(selectKegiatan);
    });


    // let selectAfdeling;
    // this.GbmOrganisasiService.getAllByType('AFDELING').subscribe(x => {
    //   // console.log(x);
    //   this.dataSelectAfdeling = [];
    //   x.forEach(d => {
    //     this.dataSelectAfdeling.push({ "id": d.id, "text": d.nama });
    //   });
    //   this.dataSelectAfdeling.forEach(a => {
    //     if (a.id == this.estPotonganKaryawan.afdeling_id) {
    //       selectAfdeling = a;
    //     }
    //   });
    //   this.entryForm.controls['afdeling_id'].patchValue(selectAfdeling);
    // });

    // let selectBlok;
    // this.GbmOrganisasiService.getAllByType('BLOK').subscribe(x => {
    //   // console.log(x);
    //   this.dataSelectBlok = [];
    //   x.forEach(d => {
    //     this.dataSelectBlok.push({ "id": d.id, "text": d.nama });
    //   });
    //   this.dataSelectBlok.forEach(a => {
    //     if (a.id == this.estPotonganKaryawan.blok_id) {
    //       selectBlok = a;
    //     }
    //   });
    //   this.entryForm.controls['blok_id'].patchValue(selectBlok);
    // });

  }

  onSubmit() {
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    // let frmData=new FormData();
    // if (this.entryForm.invalid) {
    //   return;
    // }
    let dataSubmit = this.entryForm.value;
    console.log(this.entryForm.value);
    dataSubmit['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');
    // console.log(dataSubmit);
    this.estPotonganKaryawanService.update(this.estPotonganKaryawan.id, dataSubmit).subscribe(data => {

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
