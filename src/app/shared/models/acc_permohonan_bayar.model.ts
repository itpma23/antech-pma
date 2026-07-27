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
  bongkar?: AccPermohonanBayarBongkar;

  permohonan_bayar_id:number;
  keterangan:string;
  qty:number;
  harga:number;
  jumlah:number;

}
export class AccPermohonanBayarBongkar {

    id:number;
    permohonan_bayar_id:number;
    tgl_bongkar:string;
    bill_of_landing:number;
    berat_terima:number;
    diff_terima:number;
    diff_percent_terima:number;
    toleransi_terima:number;
    sonding_muat:number;
    sonding_bongkar:number;
    diff_bongkar:number;
    diff_percent_bongkar:number;
    toleransi_bongkar:number;

}