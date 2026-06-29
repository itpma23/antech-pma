export class EstBkmUmum {
  id?: number;
  lokasi_id?:number;
  rayon_afdeling_id: number;
  no_transaksi?:string;
  keterangan?:number;
  tanggal?:string;
  no_ref?:string;
  is_asistensi?:boolean;
  detail?:EstBkmUmumDetail[];


}
export class EstBkmUmumDetail {
  id?: number;
  blok_id?:number;
  kegiatan_id?:number;
  kendaraan_id?:number;
  jenis_absensi_id?:number;
  karyawan_id?:number;
  jumlah_hk?:number;
  rupiah_hk?:number;
  premi?:number;
  ket?:number;

}
export class EstBkmUmumDenda {
  id?: number;
  kode_denda_panen_id ?:number;
  qty ?:number;
  nilai?:number;
  jumlah_nilai_denda ?:number;

}
