import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import * as Chartist from 'chartist';
import { Subject } from 'rxjs';
import { SERVER_API_URL } from 'src/app/app.constants';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvDashboardService } from 'src/app/shared/services/inv_dashboard.service';
import { isNullOrUndefined } from 'util';

export class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  dtOptions: any;
  private apiUrl = SERVER_API_URL;

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();

  pilihanBulan = [{
    id: "01",
    nama: "Januari",

  }, {
    id: "02",
    nama: "Februari",

  }, {
    id: "03",
    nama: "Maret",

  }, {
    id: "04",
    nama: "April",

  }, {
    id: "05",
    nama: "Mei",

  }, {
    id: "06",
    nama: "Juni",

  }, {
    id: "07",
    nama: "Juli",

  }, {
    id: "08",
    nama: "Agustus",

  }, {
    id: "09",
    nama: "September",

  }, {
    id: "10",
    nama: "Oktober",

  }, {
    id: "11",
    nama: "November",

  }, {
    id: "12",
    nama: "Desember",

  }
  ];
  pilihanTahun = [{
    id: "2022",
    nama: "2022",

  }, {
    id: "2023",
    nama: "2023",

  }, {
    id: "2024",
    nama: "2024",

  }, {
    id: "2025",
    nama: "2025",

  }
  ];

  selectedBulan;
  selectedTahun;
  dataSelectLokasi;
  jumlahGudang: number = 0;
  jumlahPenerimaanTanpaPO = 0;
  jumlahPemakaian = 0;
  jumlahPenerimaanPO = 0;
  jumlahPindahGudang = 0;
  jumlahPenerimaanPindahGudang = 0;
  jumlahPemakaianBKM = 0;
  jumlahAdjustment = 0;

  param_bulan = 'bulan_ini';
  selectedLokasiId: string = ''; // pastikan ini string kosong saat init
  parameterForm: any;
  invPemakaianBarang: any;

  constructor(private http: HttpClient, private gbmOrganisasiService: GbmOrganisasiService, private invDashboardService: InvDashboardService,
    private builder: FormBuilder
  ) {
    let toDate: Date = new Date();
    this.parameterForm = this.builder.group({
      lokasi: new FormControl([]),
      status: new FormControl([]),
      tanggal_mulai: new FormControl(new Date(2025, 0, 1), Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      tampilkanData: new FormControl('1',)

    });

  }
  ngOnInit() {
    this.loadDatatable();

    let hariini: Date = new Date();
    let bulan = formatDate(hariini, "MM", "en_US");
    let tahun = formatDate(hariini, "yyyy", "en_US");

    this.pilihanBulan.forEach(el => {
      if (el['id'] == bulan) {
        this.selectedBulan = el;
      }

    });
    this.pilihanTahun.forEach(el => {

      if (el['id'] == tahun) {
        this.selectedTahun = el;
      }

    });

    this.gbmOrganisasiService.getAllByType('UNIT').subscribe(x => {
      this.dataSelectLokasi = x.map(d => ({ id: d.id, text: d.nama }));
    });
  }




  onChangeBulan(changedDropdown: string) {
    this.param_bulan = this.selectedTahun['id'] + '-' + this.selectedBulan['id'];
    console.log('param_bulan:', this.param_bulan);

    const { tanggalAwal, tanggalAkhir } = this.getTanggalAwalAkhirBulan(this.selectedBulan.id, this.selectedTahun.id);

    // Update nilai form tanggal
    this.parameterForm.patchValue({
      tanggal_mulai: new Date(tanggalAwal),
      tanggal_akhir: new Date(tanggalAkhir),
    });

    // Lokasi id kalau ada, update juga ke form
    if (this.selectedLokasiId) {
      const selectedLokasi = this.dataSelectLokasi.find(d => d.id === this.selectedLokasiId);
      if (selectedLokasi) {
        this.parameterForm.patchValue({
          lokasi: selectedLokasi
        });
      }
    }

    // Biarkan status tetap null atau default
    this.parameterForm.patchValue({
      status: null
    });

    this.loadData();         // Untuk statistik
    this.loadDatatable();    // Untuk datatable
    this.rerender();
  }


  loadData() {
    const { tanggalAwal, tanggalAkhir } = this.getTanggalAwalAkhirBulan(this.selectedBulan.id, this.selectedTahun.id);

    if (this.selectedLokasiId) {
      // Ambil jumlah gudang sentral & virtual
      this.gbmOrganisasiService.getAllGudangCentralAndVirtualByLokasi(this.selectedLokasiId)
        .subscribe(res => {
          this.jumlahGudang = res.jumlah_gudang;
        });

      // List tipe transaksi & property tujuan
      const tipeList = [
        { tipe: 'PENERIMAAN_TANPA_PO', target: 'jumlahPenerimaanTanpaPO' },
        { tipe: 'PEMAKAIAN', target: 'jumlahPemakaian' },
        { tipe: 'PENERIMAAN_PO', target: 'jumlahPenerimaanPO' },
        { tipe: 'PINDAH_GUDANG', target: 'jumlahPindahGudang' },
        { tipe: 'PENERIMAAN_PINDAH_GUDANG', target: 'jumlahPenerimaanPindahGudang' },
        { tipe: 'PEMAKAIAN_BKM', target: 'jumlahPemakaianBKM' },
        { tipe: 'ADJUSTMENT', target: 'jumlahAdjustment' }
      ];

      // Loop tiap tipe & assign ke properti yang sesuai
      tipeList.forEach(item => {
        this.invDashboardService.getCountInvTransaksi({
          lokasi_id: this.selectedLokasiId,
          tanggal_awal: tanggalAwal,
          tanggal_akhir: tanggalAkhir,
          tipe: item.tipe
        }).subscribe(res => {
          if (res && res.data && typeof res.data.jumlah !== 'undefined') {
            this[item.target] = res.data.jumlah;
          } else {
            this[item.target] = 0;
          }
        }, err => {
          this[item.target] = 0; // fallback kalau request error
        });
      });

    } else {
      this.jumlahGudang = 0;
    }
  }



  getTanggalAwalAkhirBulan(bulan: string, tahun: string) {
    const tanggalAwal = `${tahun}-${bulan}-01`;
    const tanggalAkhir = new Date(Number(tahun), Number(bulan), 0); // otomatis ambil akhir bulan
    const tanggalAkhirFormatted = formatDate(tanggalAkhir, 'yyyy-MM-dd', 'en_US');
    return { tanggalAwal, tanggalAkhir: tanggalAkhirFormatted };
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload(null, false);
      setTimeout(() => {
        //this.dtTrigger.next();
      });
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  loadDatatable() {
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      serverSide: true,
      responsive: true,
      dom: "<'row'<'col-sm-5'l><'col-sm-6'f>>" +  // length di kiri, search di kanan
        "<'table-responsive'tr>" +
        "<'row'<'col-sm-6'i><'col-sm-6'p>>",   // info di kiri, pagination di kanan
      language: {
        lengthMenu: "Tampilkan _MENU_ data per halaman",
        zeroRecords: "Data tidak ditemukan",
        info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
        infoEmpty: "Tidak ada data tersedia",
        infoFiltered: "(difilter dari _MAX_ total data)",
        paginate: {
          first: "<<",
          last: ">>",
          next: ">",
          previous: "<"
        },
        processing: "Memproses..."
      },
      columns: [
        { title: 'ID', data: 'id', visible: false },
        { title: 'Lokasi', data: 'lokasi' },
        {
          title: 'Afd/Stasiun/Traksi',
          data: null,
          render: function (data, type, row) {
            return row.tipe === 'UNIT' ? row.lokasi_afd : row.lokasi_traksi;
          }
        },
        { title: 'Gudang', data: 'gudang' },
        { title: 'No Transaksi', data: 'no_transaksi' },
        { title: 'Tanggal', data: 'tanggal' },
        { title: 'Tipe', data: 'tipe' },
        {
          title: 'Status',
          data: 'is_posting',
          render: function (data, type, row) {
            return that.getStatusPP(row);
          }
        },
        {
          title: 'Users',
          data: null,
          render: function (data, type, row) {
            return `<span style="font-size:10px;"><b>dibuat</b>: ${row.dibuat}, ${that.formatTanggal(row.dibuat_tanggal)}<br>
                <b>diubah</b>: ${row.diubah}, ${that.formatTanggal(row.diubah_tanggal)}</span>`;
          }
        }
      ],
      drawCallback: function () {
        var pagination = document.querySelector('.dataTables_paginate');
        if (pagination) {
          (<HTMLElement>pagination).style.marginTop = '10px';
          (<HTMLElement>pagination).style.textAlign = 'right';
        }
      },
      ajax: (dataTablesParameters: any, callback) => {
        const statusControl = this.parameterForm.get('status');
        const lokasiControl = this.parameterForm.get('lokasi');
        const tanggalMulaiControl = this.parameterForm.get('tanggal_mulai');
        const tanggalAkhirControl = this.parameterForm.get('tanggal_akhir');
        const tampilkanDataControl = this.parameterForm.get('tampilkanData');

        const parameter = {
          status_id:
            statusControl && statusControl.value && statusControl.value.id
              ? statusControl.value.id
              : null,

          lokasi_id:
            lokasiControl && lokasiControl.value && lokasiControl.value.id
              ? lokasiControl.value.id
              : null,

          tgl_mulai:
            tanggalMulaiControl && tanggalMulaiControl.value
              ? formatDate(tanggalMulaiControl.value, "yyyy-MM-dd", 'en_US')
              : null,

          tgl_akhir:
            tanggalAkhirControl && tanggalAkhirControl.value
              ? formatDate(tanggalAkhirControl.value, "yyyy-MM-dd", 'en_US')
              : null,

          tampilkanData:
            tampilkanDataControl && tampilkanDataControl.value
              ? tampilkanDataControl.value
              : null
        };

        dataTablesParameters['parameter'] = parameter;

        this.http.post<DataTablesResponse>(
          this.apiUrl + '/InvPemakaianBarang/list',
          dataTablesParameters
        ).subscribe(resp => {
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: resp.data
          });
        });
      }
    };
  }




  getStatusPP(p) {
    let status = ""

    // Mapping jabatan
    const posisiMap = {
      'PB1': 'Asisten',
      'PB2': 'Kasie',
      'PB3': 'Manager',
      // Tambahkan lagi jika ada posisi lain
    };

    // Ambil jabatan berdasarkan posisi, jika tidak ditemukan pakai posisi aslinya
    const jabatan = posisiMap[p.last_approve_position] || p.last_approve_position;


    if (p.last_approve_position == '' && p.status == 'CREATED') {
      status = "Belum diajukan Approval";
    } else if (p.is_posting == 1 && p.idapprove == null) {
      status = 'Status Approve V1';
    } else if (p.is_posting == '0' && p.idapprove == null) {
      status = 'Belum Mengajukan Approve v2';
    }
    else if (p.status != 'RELEASE' && p.status != 'REJECTED' && p.status != 'CLOSED' && p.idapprove != null) {
      status = 'Menunggu Approval ' + jabatan;
    }
    else {
      status = p.status;
    }
    return status
  }

  formatTanggal(tanggal: string): string {
    if (!tanggal) return '-';
    const tgl = new Date(tanggal);
    return `${tgl.getDate().toString().padStart(2, '0')}/${(tgl.getMonth() + 1).toString().padStart(2, '0')}/${tgl.getFullYear()}`;
  }




}
