export class EstBkmPanen {
  id?: number;
  lokasi_id?:number;
  no_transaksi?:number;
  tanggal?:string;
  mandor_id?:number;
  mandor1_id?:number;
  asisten_id?:number;
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


  detail?:EstBkmPanenDetail[];


}
export class EstBkmPanenDetail {
  id?: number;
  blok_id?:number;
    acc_kegiatan_id?:number;
  kegiatan_id?:number;
  karyawan_id?:number;
  hasil_kerja_jjg?:number;
  hasil_kerja_brondolan?:number;
  bjr?:number;
  hasil_kerja_luas?:number;
  jumlah_hk?:number;
  rp_hk?:number;
  hasil_kerja_kg?:number;
  premi_brondolan?:number;
  premi_basis?:number;
  premi_lebih_basis?:number;
  premi_panen?:number;
  denda_panen?:number;
  denda_basis?:number;
  basis_jjg?:number;
  total_pendapatan?:number;
  potongan?:number;
  keterangan_potongan?:string;
  ket?:string;
  denda?:EstBkmPanenDenda[];

}
export class EstBkmPanenDenda {
  id?: number;
  kode_denda_panen_id ?:number;
  qty ?:number;
  nilai?:number;
  jumlah_nilai_denda ?:number;

}
