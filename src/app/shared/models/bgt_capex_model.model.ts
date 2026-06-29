export class BgtCapexModel {
  id?: number;

  tahun!: number;               // YEAR(4)
  lokasi?: string | null;       // varchar(30)
  akun_id!: number;             // foreign key ke acc_akun_new
  kategori?: 'OPEX' | 'CAPEX';  // enum
  keterangan?: string | null;   // varchar(255)

  total_anggaran?: number;      // double

  dibuat_oleh?: number | null;
  dibuat_tanggal?: string | null;  // datetime
  diubah_oleh?: number | null;
  diubah_tanggal?: string | null;  // datetime

}
