import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
declare var swal: any;

@Component({
  moduleId: module.id,
  selector: 'import-cmp',
  templateUrl: 'import.component.html',
  styleUrls: ['import.component.css'],
})

export class ImportComponent implements OnInit {

  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();

  selectedFile: File | null = null;

  previewData: any[] = [];
  pagedData: any[] = [];

  isPreview = false;

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(
    private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private invItemService: InvItemService
  ) {

    this.entryForm = this.builder.group({
      file: [null]
    });

  }

  ngOnInit() {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;
  }

  previewImport() {

    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('userfile', this.selectedFile);

    this.invItemService.importExcel(formData).subscribe((res: any) => {

      if (res.status === 'OK') {

        this.previewData = res.data;
        this.isPreview = true;

        this.totalPages = Math.ceil(this.previewData.length / this.pageSize);
        this.currentPage = 1;

        this.updatePagedData();

      } else {

        swal({
          title: 'Error',
          text: res.message,
          type: 'error',
          confirmButtonClass: "btn btn-danger",
          buttonsStyling: false
        });

      }

    });

  }

  updatePagedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData = this.previewData.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedData();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedData();
    }
  }

 saveImport() {

  const validData = this.previewData.filter(x => x.status === 'OK');

  if (validData.length === 0) {
    swal("Info", "Tidak ada data yang bisa disimpan", "warning");
    return;
  }

  this.invItemService.saveImport(validData).subscribe((res: any) => {

    if (res.status === 'OK') {

      let message = `
        Berhasil Insert : ${res.inserted} data\n
        Dilewati        : ${res.skipped} data
      `;

      // Tambahkan duplicate jika ada
      if (res.duplicates && res.duplicates.length > 0) {
        message += `\n\nDuplicate:\n`;
        res.duplicates.forEach(d => {
          message += `- Baris ${d.row} (${d.kode}) [${d.tipe}]\n`;
        });
      }

      // Tambahkan error jika ada
      if (res.errors && res.errors.length > 0) {
        message += `\n\nError:\n`;
        res.errors.forEach(e => {
          message += `- Baris ${e.row} (${e.kode}) : ${e.error}\n`;
        });
      }

      swal({
        title: 'Hasil Import',
        text: message,
        type: res.inserted > 0 ? 'success' : 'warning',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      });

      // hanya tutup modal jika benar-benar tidak ada error
      if (res.errors.length === 0 && res.duplicates.length === 0) {
        this.event.emit('OK');
        this.bsModalRef.hide();
      }

    } else {

      swal({
        title: 'Perhatian!',
        text: res.message || 'Proses Simpan Gagal',
        type: 'error',
        confirmButtonClass: "btn btn-danger",
        buttonsStyling: false
      });

    }

  });

}
  onClose() {
    this.bsModalRef.hide();
  }

}