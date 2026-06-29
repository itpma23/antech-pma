export class TrkKegiatanKendaraan {
  id?: number;
  status_kendaraan?:string;
  lokasi_id?:number;
  no_transaksi?:number;
  tanggal?:string;
  mandor_id?:number;
  mandor1_id?:number;
  asisten_id?:number;
  kerani_id: number;
  traksi_id: number;
  is_asistensi?:boolean;
  kendaraan_id: number;
  detail?:TrkKegiatanKendaraanDetail[];

  detail_log?:TrkKegiatanKendaraanLog[];



}
export class TrkKegiatanKendaraanDetail {
  blok_id(blok_id: any, acc_kegiatan_id: (blok_id: any, acc_kegiatan_id: any, karyawan_id: number, hasil_kerja: number, jumlah_hk: number, rupiah_hk: number, premi: number) => void, karyawan_id: number, hasil_kerja: number, jumlah_hk: number, rupiah_hk: number, premi: number) {
    throw new Error('Method not implemented.');
  }
  acc_kegiatan_id(blok_id: any, acc_kegiatan_id: any, karyawan_id: number, hasil_kerja: number, jumlah_hk: number, rupiah_hk: number, premi: number) {
    throw new Error('Method not implemented.');
  }
  id?: number;

  karyawan_id?:number;
  hasil_kerja?:number;
  jumlah_hk?:number;
  rupiah_hk?:number;
  premi?:number;
  denda_traksi?:number;
  ket_denda?:string;



}
export class TrkKegiatanKendaraanLog {
  id?: number;
  blok_id?:number;
  acc_kegiatan_id?:number;
  km_hm_mulai ?:number;
  km_hm_akhir ?:number;
  km_hm_jumlah ?:number;
  volume?:number;
  ket?:string;


}

