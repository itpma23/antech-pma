export class AccKegiatan {
	id?: number;

  kode?:string;
  nama?:string;
  acc_akun_id?:number;
  kegiatan_kelompok_id?:number;
  tipe_kegiatan?:string;
  uom_id?:number;
  is_pemeliharaan?: boolean;
  is_bahan?: boolean;
  is_traksi?: boolean;
  is_umum?: boolean;
  is_premi_otomatis?: boolean;
  is_traksi_mill?: boolean;
  basis?:number;
  premi_basis?:number;
  premi_lebih_basis?:number;
  // tanggal?:string;
}
