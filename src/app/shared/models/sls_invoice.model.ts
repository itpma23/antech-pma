export class SlsInvoice {
	id?: number;

  no_invoice?: string;
  tanggal?: string;
  mill_id?:number;

  no_rekap?: string;
  customer?: string;
  tanggal_rk?: string;
  total_berat_terima?: number;
  harga_satuan ?: number;
  jumlah?: number;
  sub_total ?:number;

  disc?: number;
  uang_muka?: number;
  dpp?: number;
  ppn?: number;
  grand_total?:number;
  sls_rekap_id: any;
  customer_id: any;
  lokasi_id: any;


}
