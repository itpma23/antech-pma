export class EstSpkBA {
  id?: number;
  lokasi_id?:number;
  supplier_id?:number;
  no_transaksi?:number;
  spk_id?:number;
  tanggal?:string;
  tanggal_tempo?:string;
  total?:number;
  pph_persen?:number;
  pph_nilai?:number;
  subtotal?:number;
  estimasi?:string;
  tgl_mulai?:string;
  tgl_akhir?:string;
  supplier?:string;
  lokasi?:string
  pph_akun_id?:number;

  detail?:EstSpkDetail[];

  detail_log?:EstSpkLog[];



}
export class EstSpkDetail {
  // blok_id(blok_id: any, acc_kegiatan_id: (blok_id: any, acc_kegiatan_id: any, karyawan_id: number, hasil_kerja: number, jumlah_hk: number, rupiah_hk: number, premi: number) => void, karyawan_id: number, hasil_kerja: number, jumlah_hk: number, rupiah_hk: number, premi: number) {
  //   throw new Error('Method not implemented.');
  // }
  // acc_kegiatan_id(blok_id: any, acc_kegiatan_id: any, karyawan_id: number, hasil_kerja: number, jumlah_hk: number, rupiah_hk: number, premi: number) {
  //   throw new Error('Method not implemented.');
  // }

  id?: number;

  blok?:string;
  blok_id?:number;
  kegiatan?:string;
  kegiatan_id?:number;
  satuan?:string;
  hk?:number;
  volume?:number;
  total?:number;
  harga?:number;

  bapp?:[];
}
export class EstSpkDetailBapp {
  id?: number;
  blok?:string;
  blok_id?:number;
  kegiatan?:string;
  kegiatan_id?:number;
  // satuan?:string;
  real_hk?:number;
  real_volume?:number;
  // total?:number;
  real_harga?:number;
}
export class EstSpkLog {
  id?: number;
  // blok_id?:number;
  // acc_kegiatan_id?:number;
  // km_hm_mulai ?:number;
  // km_hm_akhir ?:number;
  // km_hm_jumlah ?:number;
  // volume?:number;
  // ket?:string;

}

