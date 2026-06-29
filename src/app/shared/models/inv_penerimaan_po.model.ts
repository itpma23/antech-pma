export class InvPenerimaanPo {
	id?: number;
  
  lokasi_id?:number;
  po_id?:number;
  no_surat_jalan_supplier?:string;
  gudang_id?:number;
  supplier_id?:number;
  catatan?: string;
  no_transaksi?: number;
  tanggal?: string;

  detail?:[];
  item_id?:number;
  qty?:number;
  ket?:string;
  
}