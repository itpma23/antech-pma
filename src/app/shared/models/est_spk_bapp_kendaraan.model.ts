export class EstSpkBappKendaraan {
	id?: number;
  lokasi_id?:number;
  spk_kendaraan_id?:number;
  tanggal?: string;
  tanggal_tempo ?: string;
  no_bapp?: string;
  deskripsi?: string;
  periode_mulai?: string;
  periode_sd?: string;

  pph_persen?:number;
  pph_akun_id?:number;
  pph_nilai?:number;
  
  ppn_persen?:number
  nilai_invoice?:number;
  jml_opt?:number;
  subtotal?:number;
  is_asistensi?:boolean;
  detail?:EstSpkBappKendaraanDetail[];
  detail_opt?:EstSpkBappKendaraanOpt[];

}

export class EstSpkBappKendaraanDetail {
  id?: number;
  // est_bapp_spk_kendaraan_id?:number;
  tanggal_operasi?: string;
  blok_id?:number;
  kegiatan_id?:number;
  uom_id?:number;
  qty?:number;
  hm_km_awal?:number;
  hm_km_akhir?:number;
  jml_hm_km?:number;
  harga_satuan?:number;
  jumlah?:number;
  keterangan?:string;
}

export class EstSpkBappKendaraanOpt {
  id?: number;
  // est_bapp_spk_kendaraan_id?:number;
  afdeling_id?:number;
  tanggal_opt?: string;
  kegiatan_id?:number;
  jumlah_opt?:number;
  ket?:string;

}
