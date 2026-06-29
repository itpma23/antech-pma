export class PksSjpp {
	id?: number;
  pks_timbangan_kirim_id?:number;

  mill_id?:number;
  tanki_id?:number;
  produk_id?:number;
  intruksi_id?:number;
  customer_id?:number;
  kontrak_id?:number;
  transport_id?:number;
  lab_id?:number;

  ffa?:number;
  moisture?:number;
  kadar_air_cpo?:number;
  kadar_air_kernel?:number;
  dirt?:number;
  dobi?:number;

  no_segel?:string;
  segel_1?:string;
  segel_2?:string;
  segel_3?:string;
  
  nama_pelanggan?:string;
  alamat_pengiriman?:string;
  
  tanggal?:string;
  no_surat?:number;
  no_ktp_sim?:string;
  no_polisi?:string;
  nama_pengemudi?:string;
  berat_kirim?:number;
  
  no_kendaraan?:string;
  no_kartu_timbang?:string;
  tara_kirim?:number;
  bruto_kirim?:number;
  netto_kirim?:number;
  
  // ----- validasi surat jalan

  tanggal_customer?:string;
  ffa_customer?:number;
  moist_customer?:number;
  dirt_customer?:number;
  dobi_customer?:number;
  tara_customer?:number;
  bruto_customer?:number;
  netto_customer?:number;

}
