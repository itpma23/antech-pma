export class AccJurnalEntry {
	id?: number;

  lokasi_id?:number;
  tipe_jurnal ?:string;
  gudang_id?:number;
  no_ref ?:string;
  modul ?:string;
  karyawan_id?: number;
  keterangan ?: string;
  tanggal?: string;
  no_jurnal?: string;

  detail?:[];

  debet?:number;
  kredit?:number;
  traksi_id?:number;
  blok_id?:number;
  kegiatan_id?:number;
  ket?:string;

}
