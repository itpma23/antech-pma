export class AccAngkutInvoice {
	id?: number;

  lokasi_id?:number;
  supplier_id?:number;
  rekap_id?:number;
  no_invoice?: string;
  nama_produk?: string;
  keterangan?: string;
  tanggal?: string;
  tanggal_tempo?: string;
  periode_kt_dari?: string;
  periode_kt_sd?:string;
  item_id?:string;
  sumber_timbangan?: string;
  total_berat_terima?:number;
  jumlah?:number;
  total_berat_tagihan?:number;
  harga_satuan?:number;
  harga_susut_per_kg?:number;
  toleransi?:number;
  ppn?:number;
  pph?:number;
  sub_total?:number;
  potongan?:number;
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
