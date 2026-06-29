export class SlsRekap {
	id?: number;

  lokasi_id?:number;
  customer_id?:number;
  spk_id?:number;
  nama_produk?: string;
  no_rekap?: string;
  tanggal?: string;
  periode_kt_dari?: string;
  periode_kt_sd?:string;
  item_id?:string;

  total_berat_terima?:number;
  jumlah?:number;
  total_berat_tagihan?:number;
  harga_satuan?:number;
  sub_total?:number;
  total_tagihan?:number;
  // ---------
  dt_lokasi_id?:number;
  no_kartu_timbang?:string;
  dt_tanggal?:string;
  bruto?:number;
  tara?:number;
  netto?:number;
  berat_terima?:number;

  detail?:[];

}
