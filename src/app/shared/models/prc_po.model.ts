export class PrcPo {
  id?: number;

  lokasi_id?: number;
  lokasi_pp_id?: number;
  supplier_id?: number;
  syarat_bayar_id?: number;
  franco_id?: number;
  mata_uang_id?: number;
  quotation_id?: number;
  revisi_ke?: any;
  no_po?: string;
  tanggal?: string;
  catatan?: string;
  catatan_revisi?: string;
  status_stok?: string;
  tempo_bayar?:number;
  ket_indent?:string;

  sub_total?: number;
  disc?: number;
  biaya_kirim?: number;
  ppbkb?: number;
  ppn?: number;
  pph?: number;
  grand_total?: number;
  biaya_lain?: number;
  pph_nilai?: number;

  detail?: [];
  qty?: number;
  diskon?: number;
  ket?: string;
  keterangan?: string;
  last_approve_position: string;
  upload_kontrak_manual?: any;
}
