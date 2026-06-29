export class EstBkmPemeliharaan {
  id?: number;
  lokasi_id?: number;
  no_transaksi?: number;
  tanggal?: string;
  mandor_id?: number;
  mandor1_id?: number;
  asisten_id?: number;
  kerani_id: number;
  rayon_afdeling_id: number;

  hasil_kerja_mandor?: number;
  jumlah_hk_mandor?: number;
  rp_hk_mandor?: number;
  premi_mandor?: number;
  denda_mandor?: number;
  ket_mandor?: string;
  ket_kerani?: string;

  hasil_kerja_kerani?: number;
  jumlah_hk_kerani?: number;
  rp_hk_kerani?: number;
  premi_kerani?: number;
  denda_kerani?: number;

  is_premi_kontanan?:boolean;
  is_asistensi?:boolean;
  is_asistensi_unit?:boolean;
  detail?: EstBkmPemeliharaanDetail[];

  detail_item?: EstBkmPemeliharaanItem[];


}
export class EstBkmPemeliharaanDetail {
  id?: number;
  blok_id?: number;
  acc_kegiatan_id?: number;
  karyawan_id?: number;
  hasil_kerja?: number;
  jumlah_hk?: number;
  rupiah_hk?: number;
  premi?: number;
  keterangan?: string;
  denda_pemeliharaan?: number;


}
export class EstBkmPemeliharaanItem {
  id?: number;
  gudang_id?: number;
  item_id?: number;
  kegiatan_id?: number;
  qty?: number;
  ket?: string;
  blok_id?: number;


}

