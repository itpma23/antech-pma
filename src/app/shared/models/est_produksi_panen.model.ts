export class EstProduksiPanen {
  id?: number;
  no_spat?: string;
  jenis?:string;
  rayon_id?: number;
  divisi_id?: number;
  tanggal?: string;
  keterangan?: string;
  pks_timbangan_id:number;
  no_tiket:string;
  berat_bersih:number;
  total_luas :number;
  total_hk :number;
  total_jjg :number;
  total_brondolan :number;
  total_kg_kebun:number;
  detail?:[];

}
