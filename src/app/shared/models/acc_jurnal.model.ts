export class AccJurnal {
	id?: number;

  lokasi_id?:number;
  tipe_jurnal ?:string;
  no_ref ?:string;
  no_referensi ?:string;
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
