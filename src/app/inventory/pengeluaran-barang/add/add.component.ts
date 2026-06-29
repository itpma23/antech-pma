import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, AbstractControl } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';



import { formatDate } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { InvPermintaanBarangService } from 'src/app/shared/services/inv_permintaan_barang.service';
import { InvPemakaianBarangOnlineService } from 'src/app/shared/services/inv_pemakaian_barang_online.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvPemakaianBarang } from 'src/app/shared/models/inv_pemakaian_barang.model';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { GbmUomService } from 'src/app/shared/services/gbm_uom.service';
import { AccKegiatanService } from 'src/app/shared/services/acc_kegiatan.service';
import { InvPengeluaranBarangService } from 'src/app/shared/services/inv_pengeluaran_barang.service';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';

declare var $: any;
declare var swal: any;

@Component({
  moduleId: module.id,
  selector: 'add-cmp',
  templateUrl: 'add.component.html',
  styleUrls: ['add.component.css'],
})

export class AddComponent implements OnInit, AfterViewInit {
  editor_modules: any;
  isFormSubmitted = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }

  entryForm: FormGroup;
  formUploadFile: FormGroup;


  isCollapsed: boolean = false;

  picType: string = '';         // nilai internal / eksternal
  isEksternalPIC: boolean = false;

  selectedFoto: string = '';

  karyawanList: any[] = [];

  initialQtyValues: any[];
  isInternalPIC: boolean = false;





  event: EventEmitter<any> = new EventEmitter();

  invPengeluaranBarang: InvPemakaianBarang;
  dataSelectLokasi;
  dataSelectLokasiAfd;
  dataSelectLokasiTraksi;
  dataSelectGudang;
  dataSelectKaryawan;
  dataSelectBlok;
  dataSelectKegiatan = [];
  dataSelectUom;
  dataSelectItem;
  dataSelectTipe;
  dataSelectTraksi;
  dataSelectPermintaan;
  PATH_URL;
  dbName;
  pathName;

  selectedTraksiId: any;
  selectedBlokId: any;


  selectedFileName: string = '';
  fileError: string = '';
  imagePreview: string | ArrayBuffer | null = null;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private invPermintaanBarangService: InvPermintaanBarangService,
    private authenticationService: AuthenticationService,
    private invPengeluaranBarangService: InvPengeluaranBarangService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private invPemakaianBarangService: InvPemakaianBarangOnlineService,
    private invItemService: InvItemService,
    private toastr: ToastrService,
    private gbmUomService: GbmUomService,
    private accKegiatanService: AccKegiatanService,
    private karyawanService: KaryawanService,

    private translate: TranslateService,
  ) {
    let toDate: Date = new Date();
    let time: Date = new Date();

    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;

    this.entryForm = this.builder.group({
      tanggal: new FormControl(toDate, Validators.required),
      catatan: new FormControl(''),
      no_transaksi: new FormControl(''),
      // nama_tanki: new FormControl(''),
      lokasi_id: new FormControl([], Validators.required),
      lokasi_afd_id: new FormControl([]),
      lokasi_traksi_id: new FormControl([]),
      gudang_id: new FormControl([], Validators.required),
      karyawan_id: new FormControl([], Validators.required),
      tipe: new FormControl([], Validators.required),
      inv_permintaan_id: new FormControl([]),


      details: this.builder.array([])


    });

    this.formUploadFile = this.builder.group({
      file: [null, Validators.required]
    });
  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.invPengeluaranBarang.tanggal)));
    this.entryForm.get('catatan').patchValue(this.invPengeluaranBarang.catatan);
    this.entryForm.get('no_transaksi').patchValue(this.invPengeluaranBarang.no_transaksi);

    Object.keys(this.entryForm.controls).forEach(key => {
      if (key !== 'details') {
        const control = this.entryForm.get(key);
        if (control) {
          control.disable();
        }
      }
    });

    // Hanya disable field tertentu di setiap baris details
    this.details.controls.forEach((group: AbstractControl) => {
      const fg = group as FormGroup;
      Object.keys(fg.controls).forEach(ctrlName => {
        if (ctrlName !== 'qty' && ctrlName !== 'ket') {
          fg.get(ctrlName).disable();
        }
      });
    });



  }
  public options: any;

  private loadSelect2(): void {

    this.dataSelectTipe = [
      { id: 'TRAKSI', text: 'TRAKSI' },
      { id: 'UNIT', text: 'UNIT' },
      // { id: 'WORKSHOP', text: 'WORKSHOP' },
    ];
    let selectTipe;
    this.dataSelectTipe.forEach(a => {
      if (a.id == this.invPengeluaranBarang.tipe) {
        selectTipe = a;
      }
    });
    this.entryForm.controls['tipe'].patchValue(selectTipe);
    this.entryForm.get('tipe').valueChanges.subscribe(x => {
      if (x.id == 'TRAKSI') {
        this.details.controls.forEach(x => {
          x.get('blok_id').disable();
          x.get('blok_id').patchValue([]);
          x.get('traksi_id').enable();
          x.get('traksi_id').patchValue([]);
        });
      } else {
        this.details.controls.forEach(x => {
          x.get('blok_id').enable();
          x.get('blok_id').patchValue([]);
          x.get('traksi_id').disable();
          x.get('traksi_id').patchValue([]);
        });
      }
    });



    let selectLokasi;
    this.gbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
        if (this.invPengeluaranBarang.lokasi_id == d.id) {
          selectLokasi = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_id').patchValue(selectLokasi);
    });

    let selectLokasiAfd: any = [];
    this.gbmOrganisasiService.getAllByType('AFDELING_STASIUN_WORKSHOP').subscribe(x => {
      this.dataSelectLokasiAfd = [];
      x.forEach(d => {
        this.dataSelectLokasiAfd.push({ "id": d.id, "text": d.nama });
        if (this.invPengeluaranBarang.lokasi_afd_id == d.id) {
          selectLokasiAfd = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_afd_id').patchValue(selectLokasiAfd);
    });

    let selectLokasiTraksi: any = [];
    this.gbmOrganisasiService.getAllByType('TRAKSI').subscribe(x => {
      this.dataSelectLokasiTraksi = [];
      x.forEach(d => {
        this.dataSelectLokasiTraksi.push({ "id": d.id, "text": d.nama });
        if (this.invPengeluaranBarang.lokasi_traksi_id == d.id) {
          selectLokasiTraksi = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('lokasi_traksi_id').patchValue(selectLokasiTraksi);
    });

    let selectGudang;
    this.gbmOrganisasiService.getAllGudangCentralAndVirtual().subscribe(x => {
      this.dataSelectGudang = [];
      x.forEach(d => {
        this.dataSelectGudang.push({ "id": d.id, "text": d.nama });
        if (this.invPengeluaranBarang.gudang_id == d.id) {
          selectGudang = { "id": d.id, "text": d.nama }
        }
      });
      this.entryForm.get('gudang_id').patchValue(selectGudang);
    });

    let selectKaryawan;
    this.karyawanService.getAll().subscribe(x => {
      this.karyawanList = x['data'] || [];

      this.dataSelectKaryawan = this.karyawanList.map(d => {
        if (this.invPengeluaranBarang.karyawan_id == d.id) {
          selectKaryawan = { id: d.id, text: d.nama };
          this.selectedFoto = d.foto;
        }
        return { id: d.id, text: d.nama };
      });

      this.entryForm.get('karyawan_id').patchValue(selectKaryawan);
      // PASANG valueChanges SETELAH patchValue DAN DI DALAM subscribe
      this.entryForm.get('karyawan_id').valueChanges.subscribe(selected => {
        const id = (selected && selected.id) ? selected.id : selected;
        const found = this.karyawanList.find(k => k.id == id);
        this.selectedFoto = (found && found.foto) ? found.foto : '';
      });
    });

    let selectPermintaan = {};
    // this.invPermintaanBarangService.getAll().subscribe(x=>{
    //   this.dataSelectPermintaan=[];
    //   x['data'].forEach(d => {
    //     this.dataSelectPermintaan.push({"id":d.id,"text":d.no_transaksi});
    //     if (this.invPemakaianBarang.inv_permintaan_id == d.id) {
    //       selectPermintaan = { "id": d.id, "text": d.no_transaksi }
    //     }
    //   });
    //   this.entryForm.get('inv_permintaan_id').patchValue(selectPermintaan);
    // });



    this.invItemService.getAll().subscribe(x => {
      this.dataSelectItem = [];
      x['data'].forEach(d => {
        this.dataSelectItem.push({ "id": d.id, "text": d.kode + ' - ' + d.nama + "(" + d.uom + ")" });
      });

      this.gbmUomService.getAll().subscribe(x => {
        this.dataSelectUom = [];
        x['data'].forEach(d => {
          this.dataSelectUom.push({ "id": d.id, "text": d.nama });
        });

        this.invPermintaanBarangService.getTraksi().subscribe(x => {
          this.dataSelectTraksi = [];
          x['data'].forEach(d => {
            this.dataSelectTraksi.push({ "id": d.id, "text": d.kode + '-' + d.nama });
          });

          this.gbmOrganisasiService.getAllByType('BLOK_MESIN').subscribe(x => {
            this.dataSelectBlok = [];
            x.forEach(d => {
              this.dataSelectBlok.push({ "id": d.id, "text": d.kode + ' - ' + d.nama });
            });

            this.accKegiatanService.getAllbyTipe('BAHAN').subscribe(x => {
              this.dataSelectKegiatan = [];
              x['data'].forEach(d => {
                this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama + ' - ' + d.kode });
              });
              let dtl = [];
              dtl = this.invPengeluaranBarang.detail;
              for (let index = 0; index < dtl.length; index++) {
                const d = dtl[index];
                this.addBlok(d['item_id'], d['traksi_id'], d['blok_id'], d['kegiatan_id'], d['qty'], d['ket']);
              }


            });
          });
        });
      });
    });


  }

  onSubmitAlert() {
    const currentQtyValues = this.details.controls.map(ctrl => {
      const qtyControl = ctrl.get('qty');
      return qtyControl && qtyControl.value !== undefined && qtyControl.value !== null ? qtyControl.value : 0;
    });


    const isQtyChanged = currentQtyValues.some((val, idx) => val !== this.initialQtyValues[idx]);

    let frmData = this.entryForm.getRawValue();
    let rawDetails = (this.details as FormArray).getRawValue();

    frmData.details = rawDetails;

    console.log('Form Data:', frmData);

    const swalMessage = isQtyChanged
      ? 'Apakah anda yakin ingin melakukan proses pengeluaran barang?'
      : 'Apakah anda yakin ingin melakukan proses pengeluaran?';

    let that = this;

    // Gunakan sweetalert2 .then seperti di delete()
    swal({
      title: 'Konfirmasi',
      text: swalMessage,
      type: 'info',
      showCancelButton: true,
      confirmButtonText: 'Ya, submit',
      cancelButtonText: 'Batal',
      confirmButtonClass: "btn btn-primary",
      cancelButtonClass: "btn btn-secondary",
      buttonsStyling: false,
    }).then(function () {
      that.onSubmit();
    });
  }




  onSubmit() {
    this.isFormSubmitted = true;
    console.log('ON SUBMIT POST');

    if (this.formUploadFile.invalid && this.isEksternalPIC) {
      // Kalau eksternal, wajib upload file, kalau internal skip cek formUploadFile
      return;
    }

    let frmData = this.entryForm.getRawValue();
    const fileControl = this.formUploadFile.get('file');
    const file: File = fileControl ? fileControl.value : null;

    // Step 1: Update dulu
    this.invPemakaianBarangService.update(this.invPengeluaranBarang.id, frmData).subscribe(updateResponse => {
      if (updateResponse['status'] === 'OK') {
        console.log('Update OK, lanjut proses berikutnya');

        if (this.isInternalPIC) {
          // Kalau internal, langsung ke proses posting tanpa uploadEvidence
          this.prosesPosting();
        } else {
          // Kalau eksternal, lanjut upload evidence dulu
          this.invPengeluaranBarangService.uploadEvidence(this.invPengeluaranBarang.id, file).subscribe(uploadResponse => {
            if (uploadResponse['status'] === 'OK') {
              this.prosesPosting();
            } else {
              swal({
                title: 'Upload Gagal',
                text: uploadResponse['message'] || 'Gagal mengunggah file',
                type: 'warning',
                confirmButtonClass: "btn btn-danger",
                buttonsStyling: false
              });
            }
          });
        }
      } else {
        swal({
          title: 'Gagal Update Data',
          text: updateResponse['message'] || 'Gagal menyimpan perubahan data.',
          type: 'warning',
          confirmButtonClass: "btn btn-warning",
          buttonsStyling: false
        });
        return;
      }
    });
  }

  // Pisahkan proses posting supaya bisa dipanggil dari dua tempat
  prosesPosting() {
    this.invPengeluaranBarangService.proses(this.invPengeluaranBarang.id, {}).subscribe(postingResponse => {
      if (postingResponse['status'] === 'OK') {
        swal({
          title: 'Info!',
          text: 'Data berhasil diSimpan',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        }).then(() => {
          this.event.emit('OK');
          this.bsModalRef.hide();
          location.reload();
        });
      } else {
        const items = postingResponse['data'];
        if (Array.isArray(items)) {
          let msg = '';
          items.forEach(element => {
            msg += element['kode'] + '-' + element['nama'] + ', Stok: ' + element['stok'] + '\n';
          });
          swal({
            title: 'Info!',
            text: 'Ada Stok Minus.\n' + msg + '\n',
            type: 'warning',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          });
        } else {
          swal({
            title: 'Info!',
            text: 'Proses Posting gagal: ' + postingResponse['data'] + '\n',
            type: 'warning',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          });
        }
      }
    });
  }




  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };

  addBlokNew() {
    if (this.entryForm.get('tipe').value.id == 'TRAKSI') {
      this.details.push(this.builder.group({
        qty: new FormControl('1', Validators.required),
        item_id: new FormControl([]),
        blok_id: new FormControl({ value: [], disabled: 'disabled' }),
        traksi_id: new FormControl([]),
        kegiatan_id: new FormControl([], Validators.required),
        ket: new FormControl(''),
      }));
    } else {
      this.details.push(this.builder.group({
        qty: new FormControl('1', Validators.required),
        item_id: new FormControl([]),
        blok_id: new FormControl([]),
        traksi_id: new FormControl({ value: [], disabled: 'disabled' }),
        kegiatan_id: new FormControl([], Validators.required),
        ket: new FormControl(''),
      }));
    }
  }


  addBlok(item_id, traksi_id, blok_id, kegiatan_id, qty, ket) {

    this.dataSelectBlok;
    this.dataSelectKegiatan;
    this.dataSelectUom;
    this.dataSelectItem;

    let selectedItem = [];
    this.dataSelectItem.forEach(a => {
      if (item_id == a.id) {
        selectedItem = a;
      }
    });
    let selectedTraksi = [];
    this.dataSelectTraksi.forEach(a => {
      if (traksi_id == a.id) {
        selectedTraksi = a;
      }
    });
    let selectedBlok = [];
    this.dataSelectBlok.forEach(a => {
      if (blok_id == a.id) {
        selectedBlok = a;
      }
    });
    let selectedKegiatan = [];
    this.dataSelectKegiatan.forEach(a => {
      if (kegiatan_id == a.id) {
        selectedKegiatan = a;
      }
    });

    console.log('SELECTED TRAKSI =>', selectedTraksi);

    let tipe = this.entryForm.get('tipe').value['id'];
    if (tipe == 'TRAKSI') {
      let fb = this.builder.group({
        item_id: new FormControl(selectedItem),
        traksi_id: new FormControl(selectedTraksi),
        blok_id: new FormControl({ value: selectedBlok, disabled: "disabled" }),
        kegiatan_id: new FormControl(selectedKegiatan, Validators.required),
        qty: new FormControl(qty),
        ket: new FormControl(ket),
      });
      this.details.push(fb);
    } else {
      let fb = this.builder.group({
        item_id: new FormControl(selectedItem),
        traksi_id: new FormControl({ value: selectedTraksi, disabled: "disabled" }),
        blok_id: new FormControl(selectedBlok),
        kegiatan_id: new FormControl(selectedKegiatan, Validators.required),
        qty: new FormControl(qty),
        ket: new FormControl(ket),
      });
      this.details.push(fb);

    }
  }




  removeBlokItem(item) {
    let i = this.details.controls.indexOf(item);
    if (i != -1) {
      // let x=	this.details.controls.splice(i, 1);
      let items = this.entryForm.get('details') as FormArray;
      items.removeAt(i);
      let data = { details: items.value };
      this.updateForm(data);
    }
  }




  updateForm(data) {

  }
  recalculate() {
  }
  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();
    this.toastr.info('Data Qty bisa diedit bila diperlukan.', 'Informasi')
    this.initialQtyValues = this.details.controls.map(ctrl => {
      const qtyControl = ctrl.get('qty');
      return (qtyControl !== null && qtyControl !== undefined && qtyControl.value !== null && qtyControl.value !== undefined)
        ? qtyControl.value
        : 0;
    });

    this.entryForm.get('karyawan_id').valueChanges.subscribe(selected => {
      const id = (selected && selected.id) ? selected.id : selected;
      const found = this.karyawanList.find(k => k.id == id);
      this.selectedFoto = (found && found.foto) ? found.foto : '';
    });








  }
  valueChange($event) {
    // console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.handleFile(file);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  handleFile(file: File): void {
    this.fileError = '';
    this.imagePreview = null;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (!allowedTypes.includes(file.type)) {
      this.fileError = 'Format file tidak didukung. Hanya .jpg, .jpeg, .png';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.fileError = 'Ukuran file maksimal 5MB';
      return;
    }

    this.selectedFileName = file.name;
    const fileControl = this.formUploadFile.get('file');
    if (fileControl) {
      fileControl.setValue(file);
    }


    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  clearImage(event: Event): void {
    event.stopPropagation(); // agar tidak trigger file input lagi
    this.selectedFileName = null;
    this.imagePreview = null;
    this.fileError = null;

    const fileControl = this.formUploadFile.get('file');
    if (fileControl) {
      fileControl.setValue(null);
    }
  }
  private enableQtyKet(fg: FormGroup): void {
    if (fg.get('qty')) fg.get('qty').enable();
    if (fg.get('ket')) fg.get('ket').enable();
  }

  onPICChange(event: any) {
    this.picType = event.target.value;
    this.isEksternalPIC = this.picType === 'eksternal';
    this.isInternalPIC = this.picType === 'internal';
    const karyawanCtrl = this.entryForm.get('karyawan_id');

    if (this.picType === 'internal') {
      if (karyawanCtrl) {
        karyawanCtrl.enable();
      }
    }
  }




}
