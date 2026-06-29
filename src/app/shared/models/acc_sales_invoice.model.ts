export class AccSalesInvoice {
	id?: number;

  no_invoice?: string;
  tanggal?: string;
  tanggal_tempo?: string;
  lokasi_id?:number;
  customer_id?:number;
  sls_kontrak_id?:number;
  proforma_id?:number;

  jenis_invoice?: string;
  deskripsi?: string;
  no_referensi?: string;
  tanggal_rk?: string;
  qty?: number;
  harga_satuan ?: number;
  jumlah?: number;
  premi?: number;

  diskon?: number;
  uang_muka?: number;
  dpp?: number;
  ppn?: number;
  grand_total?:number;
  sls_rekap_id?: number;
  acc_akun_id_kredit? : number;
  acc_akun_id_debet ?: number;
  user_ttd ?: string;
  qty_real: number;
  detail?:AccSalesInvoiceDetail[];




}
export interface AccSalesInvoiceDetail {
  id?: number;
  sls_invoice_id?: number;
  rekap_id?: number;
  no_rekap?: string;
  qty?: number;
  harga?: number;
  total?: number;
  keterangan?: string;
}
