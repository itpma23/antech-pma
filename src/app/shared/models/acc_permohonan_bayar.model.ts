export class AccPermohonanBayar {

	id: number;
  supplier_id:number;
  karyawan_id:number;
  supplier:string;
  txt_biaya_lain:string;
  tanggal: string;
  tanggal_tempo: string;
  no_transaksi: string;
  no_referensi: string;
  diminta_oleh: string;
  divisi: string;
  periode: string;
  ket: string;
  catatan: string;
  jenis_invoice: any;
  noTipe_id: any;
  nama_bank: string;
  no_rek: string;
  atas_nama: string;

  subtotal:number;
  diskon:number;
  dpp:number;
  pph:number;
  ppn:number;
  ppnbm:number;
  biaya_lain:number;
  total:number;
  

  detail?:[];

  permohonan_bayar_id:number;
  keterangan:string;
  qty:number;
  harga:number;
  jumlah:number;
  
  

}
