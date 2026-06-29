

export interface IUserProfile {
  id?: number;
  user_kode?: string;
  user_pwd?: string;
  user_nama?: string;
  user_ktp?: string;
  user_gender?: string;
  user_hp?: string;
  user_hpoth?: string;
  user_email?: string;
  user_alamat?: string;
  user_valid?:string;
  rob_kode?:string;
  prop_kode?: string;
  kota_kode?: string;
  kec_kode?: string;
  kel_kode?: string;
  dt_created?: string;
  dt_updated?: string;
  user_passchg?: string;
  user_otp?: string;
  prop_nama?: string;
  kota_nama?: string;
  kec_nama?: string;
  kel_nama?: string;
  robot_confirm?:string;
  email_ref?:string;
  iso?:string;

}

export class UserProfile implements IUserProfile {
  constructor(
    public id?: number,
    public user_kode?: string,
    public user_pwd?: string,
    public user_nama?: string,
    public user_ktp?: string,
    public user_gender?: string,
    public user_hp?: string,
    public user_hppoth?: number,
    public user_email?: string,
    public user_alamat?: string,
    public prop_kode?: string,
    public kota_kode?: string,
    public kec_kode?: string,
    public kel_kode?: string,
    public rob_kode?: string,
    public user_valid?: string,
    public user_passchg?: string,
    public user_otp?: string,
    public dt_created?: string,
    public dt_updated?: string,
    public prop_nama?: string,
    public kota_nama?: string,
    public kec_nama?: string,
    public kel_nama?: string,
    public robot_confirm?:string,
    public email_ref?:string,
    public iso?:string,

  ) {}
}
