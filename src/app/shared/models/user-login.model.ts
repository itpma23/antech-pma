

export interface IUserLogin {
  id?: number;
  role?: string;
  user_pass?: string;
  user_name?: string;
  dt_created?: string;
  dt_updated?: string;


}

export class UserLogin implements IUserLogin {
  constructor(
    public id?: number,
    public role?: string,
    public user_pass?: string,
    public user_name?: string,
    public dt_created?: string,
    public dt_updated?: string,

  ) {}
}
