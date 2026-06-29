export class AccApInvoice {
  id?: number;

  no_invoice?: string;
  no_invoice_supplier?: string;
  tanggal?: string;
  tanggal_tempo?: string;
  lokasi_id?: number;
  supplier_id?: number;
  po_id?: number;
  akun_kredit_id?: number;

  jenis_invoice?: string;
  deskripsi?: string;
  no_referensi?: string;
  tanggal_terima?: string;
  nilai_invoice?: number;
  no_faktur_pajak: any;
  acc_akun_supplier?: number;
  termin_id?: string;

  detail?:[];


}
