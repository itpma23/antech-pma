export class WrkKegiatan {
  id?: number;
  lokasi_id?:number;
  workshop_id?:number;
  kendaraan_mesin_id: number;
  mesin_id: number;
  stasiun_id: number;
  tanggal?:string;

  km_hm_mulai:number;
  km_hm_akhir:number;
  tgl_mulai:string;
  tgl_akhir:string;
  lama_perbaikan:number;
  kerusakan:string;
  alasan:string;

  no_transaksi?:string;
  detail?:WrkKegiatanDetail[];

  detail_item?:WrkKegiatanDetail[];

  detail_log?:WrkKegiatanLog[];
}


export class WrkKegiatanDetail {
  blok_id(blok_id: any, acc_kegiatan_id: (blok_id: any, acc_kegiatan_id: any, karyawan_id: number, hasil_kerja: number, jumlah_hk: number, rupiah_hk: number, premi: number) => void, karyawan_id: number, hasil_kerja: number, jumlah_hk: number, rupiah_hk: number, premi: number) {
    throw new Error('Method not implemented.');
  }
  acc_kegiatan_id(blok_id: any, acc_kegiatan_id: any, karyawan_id: number, hasil_kerja: number, jumlah_hk: number, rupiah_hk: number, premi: number) {
    throw new Error('Method not implemented.');
  }
  id?: number;
  wrk_kegiatan_id?:number;
  karyawan_id?:number;
  jumlah_hk?:number;
  rupiah_hk?:number;
  premi?:number;
}

export class WrkKegiatanDetailItem {
  // blok_id(blok_id: any, acc_kegiatan_id: (blok_id: any, acc_kegiatan_id: any, karyawan_id: number, hasil_kerja: number, jumlah_hk: number, rupiah_hk: number, premi: number) => void, karyawan_id: number, hasil_kerja: number, jumlah_hk: number, rupiah_hk: number, premi: number) {
  //   throw new Error('Method not implemented.');
  // }
  // acc_kegiatan_id(blok_id: any, acc_kegiatan_id: any, karyawan_id: number, hasil_kerja: number, jumlah_hk: number, rupiah_hk: number, premi: number) {
  //   throw new Error('Method not implemented.');
  // }
  id?: number;
  wrk_kegiatan_id?:number;
  item_id?:number;
  qty?:number;
  ket?:string;
}


export class WrkKegiatanLog {
  id?: number;
  blok_id?:number;
  acc_kegiatan_id?:number;
  jumlah_jam ?:number;
  volume?:number;
  ket?:string;
}

export class WrkKegiatanKendaraanLog {
  id?: number;
  blok_id?:number;
  kendaraan_id?:number;
  acc_kegiatan_id?:number;
  jumlah_jam ?:number;
  hm_km?:number;
  volume?:number;
  ket?:string;


}
