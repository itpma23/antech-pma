export class PrcApprovallSetting {
	id?: number;

  lokasi_id?:number;
  karyawan_id?:number;
  kode?:string;
  kode_id?:string;
  is_ready_po: boolean;
}

export class InvApprovalSettingPb {
    id?: number;

  lokasi_id?:number;
  karyawan_id?:number;
  kode?:string;
  kode_id?:string;
  is_ready_po: boolean;
      is_finish?: boolean;
    is_need_approve?: boolean
}

