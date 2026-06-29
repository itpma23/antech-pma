export class InvReturPemakaianBarang {
	id?: number;

  lokasi_id?:number;
  inv_permintaan_id?:number;
  lokasi_afd_id?:number;
  lokasi_traksi_id?:number;
  gudang_id?:number;
  tipe?:string;
  karyawan_id?: number;
  inv_pemakaian_id?: number;
  catatan?: string;
  tanggal?: string;
  no_transaksi?: string;

  detail?:[];
  item_id?:number;
  uom_id?:number;
  qty?:number;
  traksi_id?:number;
  blok_id?:number;
  kegiatan_id?:number;
  ket?:string;

}
