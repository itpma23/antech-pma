export class AccKasbank {
  supplier_id(supplier_id: any) {
    throw new Error('Method not implemented.');
  }
	id?: number;

  lokasi_id?:number;
  tipe_jurnal ?:string;
  tipe_bayar ?:string;
  sumber_dokumen ?:string;
  akun_kasbank_id?:number;
  permintaan_id?:number;
  ref_id?:number;
  no_ref ?:string;
  no_referensi ?:string;
  penerima ?:string;
  nilai?: any;
  modul ?:string;
  karyawan_id?: number;
  keterangan ?: string;
  tanggal?: string;
  no_transaksi?: string;

  detail?:[];

  debet?:number;
  kredit?:number;
  traksi_id?:number;
  blok_id?:number;
  kegiatan_id?:number;
  ket?:string;

}
