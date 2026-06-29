export class AccTbsInvoice {
  insentif(insentif: any): number {
    throw new Error('Method not implemented.');
  }
	id?: number;

  lokasi_id?:number;
  supplier_id?:number;
  rekap_id?:number;
  no_invoice?: string;
  nama_produk?: string;
  tanggal?: string;
  tanggal_tempo?: string;
  periode_kt_dari?: string;
  periode_kt_sd?:string;
  item_id?:string;

  total_berat_terima?:number;
  jumlah?:number;
  total_berat_tagihan?:number;
  harga_satuan?:number;
  ppn?:number;
  pph?:number;
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

  rekap_list?: { id: number; no_rekap: string }[];

}


export class AccKuitansiPembelianTbs {
	id?: number;

  lokasi_id?:number;
  supplier_id?:number;
  rekap_id?:number;
  no_invoice?: string;
  nama_produk?: string;
  tanggal?: string;
  tanggal_tempo?: string;
  periode_kt_dari?: string;
  periode_kt_sd?:string;
  item_id?:string;

  total_berat_terima?:number;
  jumlah?:number;
  total_berat_tagihan?:number;
  harga_satuan?:number;
  ppn?:number;
  pph?:number;
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
