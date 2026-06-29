export class AkunMigrasi {
  /** ===== IDENTITAS ===== */
  akun_new_id?: number;     
  akun_id?: number | null;  

  /** ===== DATA UTAMA ===== */
  kode: string;
  nama_baru: string;
  nama_lama?: string | null;

  tipe_baru?: number;
  tipe_lama?: number | null;

  kelompok?: string | null;
  kelompok_biaya?: string | null;

  /** ===== FLAG AKUN ===== */
  aktif?: boolean;
  is_transaksi_akun?: boolean;
  is_kasbank_akun?: boolean;

  /** ===== STATUS MIGRASI ===== */
  status: 'BARU' | 'EXISTING';

  /** ===== UI STATE (FRONTEND ONLY) ===== */
  selected?: boolean;   
  draggable?: boolean;  
}
