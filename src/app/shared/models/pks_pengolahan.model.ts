export class PksPengolahan {
  id?: number;
  mill_id?:number;
  no_transaksi?:number;
  tanggal?:string;
  total_jam_proses?:number;
  total_jumlah_rebusan?:number;
  tbs_olah?:number;
  
  
  // jumlah_lori?:number;
  // cpo_moisture?:number;
  // cpo_dobi?:number;
  // cpo_ffa?:number;
  // cpo_dirt?:number;
  // kernel_moisture?:number;
  // kernel_dobi?:number;
  // kernel_ffa?:number;
  // kernel_dirt?:number;
  
  
  detail?:[];
  shift_id?:number;
  mandor_id?:number;
  asisten_id?:number;
  jam_masuk?:number;
  jam_selesai?:number;
  jam_proses?:number;
  jumlah_rebusan?:number;
  
  detail_mesin?:[];
  mesin_id?:number;
  keterangan?: string;

  detail_item?:[];
  qty?:number;
  no_issue?:number;

  cpo_moisture?:number;
  cpo_dobi?:number;
  cpo_ffa?:number;
  cpo_dirt?:number;
  
  kernel_moisture?: number;
  kernel_dobi?:number;
  kernel_ffa?:number;
  kernel_dirt?: number;
  
  cpo_los_fruit?: number;
  cpo_los_press?:number;
  cpo_los_nut?:number;
  cpo_los_e_bunch?:number;
  cpo_los_effluent?:number;
  
  kernel_los_fruit?:number;
  kernel_los_fiber_cyclone?:number;
  kernel_los_ltds1?:number;
  kernel_los_ltds2?:number;
  kernel_los_claybath?:number;

}
