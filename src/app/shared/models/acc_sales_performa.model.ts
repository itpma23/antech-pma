export class AccSalesPerforma {
	id?: number;

  no_performa?: string;
  tanggal?: string;
  tanggal_tempo?: string;
  lokasi_id?:number;
  customer_id?:number;
  sls_kontrak_id?:number;

  jenis_performa?: string;
  deskripsi?: string;
  no_referensi?: string;
  tanggal_rk?: string;
  qty?: number;
  harga_satuan ?: number;
  jumlah?: number;

  diskon?: number;
  uang_muka?: number;
  dpp?: number;
  ppn?: number;
  grand_total?:number;
  sls_rekap_id?: number;
  acc_akun_id_kredit? : number;
  acc_akun_id_debet ?: number;
  user_ttd ?: string;

  bank_id?: number;
  cabang_bank?: string;
  atas_nama?: string;
  no_rekening?: string;

}
