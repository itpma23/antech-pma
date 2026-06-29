export class InvPindahGudang {
	id?: number;

  lokasi_id?:number;
  ke_gudang_id?:number;
  inv_permintaan_pindah_gudang_id: any;
  dari_gudang_id?:number;
  tipe?:string;
  nama_peminta?:string;
  karyawan_id?: number;
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
