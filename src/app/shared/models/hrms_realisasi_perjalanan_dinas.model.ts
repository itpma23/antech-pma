export class HrmsRealisasiPerjalananDinas {
	id?: number;
  lokasi_id?:number;
  karyawan_id?:number;
  perjalanan_dinas_id?:number;
  dari_lokasi_id?:number;
  ke_lokasi_id?:number;
  catatan?: string;
  tanggal?: string;
  no_transaksi?: string;

  detail?:[];
  komponen_perjalanan_dinas_id?:number;
  nilai?:number;
  ket?:string;
  
}