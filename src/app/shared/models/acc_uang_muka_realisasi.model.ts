export class AccUangMukaRealisasi {
  id?: number;
  lokasi_id?: number;
  no_transaksi?: string;
  tanggal?: string;

  acc_uang_muka_id?: number;
  acc_permintaan_dana_id?: number;

  is_permintaan_dana?: number;

  acc_akun_uang_muka_id?: number;
  acc_akun_kasbank_id?: number;
  acc_akun_realisasi_id?: number;

  nilai_uang_muka?: number;
  nilai_realisasi?: number;
  keterangan?: string;

  is_posting?: number;

detail?: any[];
}
