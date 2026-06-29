import { Component, OnInit, AfterViewInit, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SERVER_API_URL } from 'src/app/app.constants';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { TradingKontrakService } from 'src/app/shared/services/trading_kontrak.service';

declare var swal: any;

@Component({
  moduleId: module.id,
  selector: 'download-cmp',
  templateUrl: 'download.component.html',
  styleUrls: ['download.component.css'],
})
export class DownloadComponent implements OnInit, AfterViewInit {
  // Menerima ID Kontrak yang dilempar dari komponen utama saat modal dibuka
  kontrakId: any;

  // Property untuk menampung file Word yang dipilih user saat upload
  selectedWordFile: File | null = null;

  // Status upload dokumen untuk binding ke template jika diperlukan
  isUploaded: boolean = false;

  event: EventEmitter<any> = new EventEmitter();

  constructor(
    public bsModalRef: BsModalRef,
    private http: HttpClient,
    private authService: AuthenticationService,
    private tradingKontrakService: TradingKontrakService
  ) { }

  ngOnInit(): void {
    // Logic yang dijalankan saat komponen pertama kali dimuat
    if (!this.kontrakId) {
      console.warn('Warning: Kontrak ID tidak ditemukan.');
    }
  }

  ngAfterViewInit(): void {
    // Inisialisasi library pihak ketiga jika dibutuhkan setelah view siap
  }

  /**
   * AKSI 1: Mengunduh file master Word (.docx) hasil inputan dari server
   */
  downloadKontrakWord(): void {

    if (!this.kontrakId) {
      swal('Error', 'Data Kontrak tidak valid.', 'error');
      return;
    }

    swal({
      title: 'Mohon Tunggu',
      text: 'Sedang menyiapkan dokumen kontrak...',
      allowOutsideClick: false,
      onOpen: () => {
        swal.showLoading();
      }
    });

    this.tradingKontrakService.downloadWord(this.kontrakId)
      .subscribe(
        (response: any) => {

          swal.close();

          let fileName = 'Kontrak.docx';

          const disposition = response.headers.get('Content-Disposition');

          if (disposition) {

            const match = disposition.match(/filename="?([^"]+)"?/i);

            if (match && match[1]) {
              fileName = match[1];
            }

          }

          const blob = response.body;

          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          window.URL.revokeObjectURL(url);

        },
        err => {

          swal.close();

          console.error(err);

          swal(
            'Gagal',
            'Gagal mengunduh dokumen kontrak.',
            'error'
          );

        }
      );

  }

  /**
   * AKSI 2: Event handler saat user memilih file Word (.docx) untuk diupload
   */
onWordFileSelected(event: any): void {

  this.selectedWordFile = null;

  if (!event || !event.target || !event.target.files || event.target.files.length === 0) {
    return;
  }

  const file = event.target.files[0];

  const ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();

  if (ext !== 'docx') {

    swal(
      'Format Salah',
      'Mohon unggah file Microsoft Word (.docx).',
      'warning'
    );

    event.target.value = '';

    return;
  }

  this.selectedWordFile = file;

}
  /**
   * AKSI FOOTER 1: Simpan seluruh perubahan berkas dokumen ke server
   */
  saveAllChanges(): void {

    if (!this.selectedWordFile) {

      swal(
        'Informasi',
        'Silakan pilih file Word (.docx) terlebih dahulu.',
        'info'
      );

      return;
    }

    swal({
      title: 'Menyimpan Dokumen',
      text: 'Sedang mengunggah revisi kontrak...',
      allowOutsideClick: false,
      onOpen: () => {
        swal.showLoading();
      }
    });

    this.tradingKontrakService
      .uploadWord(
        this.kontrakId,
        this.selectedWordFile
      )
      .subscribe(

        (res: any) => {

          swal.close();

          if (res.status === 'OK') {

            this.isUploaded = true;

            swal({
              title: 'Berhasil',
              text: 'Dokumen kontrak berhasil diperbarui.',
              type: 'success',
              confirmButtonClass: 'btn btn-success',
              buttonsStyling: false
            }).then(() => {

              this.event.emit('OK');

              this.bsModalRef.hide();

            });

          } else {

            swal(
              'Gagal',
              res.data,
              'error'
            );

          }

        },

        err => {

          swal.close();

          console.error(err);

          swal(
            'Gagal',
            'Terjadi kesalahan saat mengunggah dokumen.',
            'error'
          );

        }

      );

  }

  /**
   * AKSI FOOTER 2: Menutup modal tanpa menyimpan perubahan
   */
  onClose(): void {
    this.bsModalRef.hide();
  }
}