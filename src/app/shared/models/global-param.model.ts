

export interface IGlobalParam {
  id?: number;
  param_kode?: string;
  param_value?: string;


}

export class GlobalParam implements IGlobalParam {
  constructor(
    public id?: number,
    public param_kode?: string,
    public param_value?: string,


  ) {}
}
