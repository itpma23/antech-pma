export class PksMaintenanceLog {
	id?: number;

  mesin_id ?:number;
  jenis_maintenance_id?:number;
  tanggal ?:string;
  ket ?:string;
  hm_km?:number;

  detail ?:[];
  sparepart_id?:number;
  qty?:number;
}
