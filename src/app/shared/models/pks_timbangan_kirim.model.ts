export class PksTimbanganKirim {
  id?: number;

  tanggal?: string;
  tangki_id?: number;
  mill_id?: number;
  item_id?: number;
  transportir_id?: number;
  customer_id?: number;
  instruksi_id?: number;
  sjpp_id?: number;
  no_surat?: string;
  no_ktp_sim?: string;
  no_kontrak_timbangan?: string;
  no_do_timbangan?: string;
  tipe?: string;

  no_tiket?: string;
  // no_reprensi?:string;
  no_referensi?: string;

  jam_masuk?: string;
  jam_keluar?: string;

  jumlah_item?: number;
  jumlah_berondolan?: number;

  no_kendaraan?: string;
  nama_supir?: string;

  tara_kirim?: number;
  bruto_kirim?: number;
  netto_kirim?: number;
  ffa?: number;
  moisture?: number;
  dirt?: number;
  dobi?: number;
  suhu?: number;
  jumlah_segel?: number;
  no_segel?: string;

  segel_1?: string;
  segel_2?: string;
  segel_3?: string;

  keterangan?: string;
  uoid?: string;
  segel_5: any;
  segel_4: any;
}
