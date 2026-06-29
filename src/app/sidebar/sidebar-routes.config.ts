import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard', icon: 'material-icons' },
    { path: '/pengajar', title: 'Pengajar', icon: 'material-icons' },
    { path: '/siswa', title: 'Siswa', icon: 'material-icons' },
    { path: '/mapel/list', title: 'Mapel', icon: 'material-icons' },
    { path: '/kelas/list', title: 'Kelas', icon: 'material-icons' },
    { path: '/kelasmapel/list', title: 'Kelas Mapel', icon: 'material-icons' },
    { path: '/tugas/list', title: 'Tugas', icon: 'material-icons' },
    { path: '/materi/list', title: 'Materi', icon: 'material-icons' },
    { path: '/materi/detail', title: 'Materi Detail', icon: 'material-icons' },
    { path: '/tugas/list-siswa', title: 'Tugas', icon: 'material-icons' },
    { path: '/materi/list-siswa', title: 'Materi', icon: 'material-icons' },
    { path: '/pengumuman/list', title: 'Pengumuman', icon: 'material-icons' },
    { path: '/profile', title: 'Profile', icon: 'material-icons' },
    { path: '/keuangan/akun', title: 'Akun', icon: 'material-icons' },
    { path: '/keuangan/piutang-setting', title: 'Piutang Setting', icon: 'material-icons' },
    { path: '/keuangan/proses-piutang', title: 'Proses Piutang', icon: 'material-icons' },
    { path: '/keuangan/daftar-piutang', title: 'Daftar Piutang', icon: 'material-icons' },
    { path: '/keuangan/bayar-piutang', title: 'Bayar Piutang', icon: 'material-icons' },
    { path: '/keuangan/kasbank', title: 'Kasn Bank', icon: 'material-icons' },
    { path: '/keuangan/laporan', title: 'Laporan Keuangan', icon: 'material-icons' },
    { path: '/hrms/tipe-karyawan', title: 'Tipe Karyawan', icon: 'material-icons' },
    { path: '/hrms/departemen', title: 'Departemen', icon: 'material-icons' },
    { path: '/hrms/jabatan', title: 'Jabatan', icon: 'material-icons' },
    { path: '/hrms/karyawan', title: 'Karyawan', icon: 'material-icons' },
    { path: '/hrms/laporan', title: 'Laporan Gaji', icon: 'material-icons' },
    { path: '/hrms/proses-payroll', title: 'Proses Payroll', icon: 'material-icons' },
    { path: '/inventory/gudang', title: 'Gudang', icon: 'material-icons' },
    { path: '/inventory/daftar-pb', title: 'Daftar Pemakaian Barang', icon: 'material-icons' },
    { path: '/inventory/kategori', title: 'Kategori', icon: 'material-icons' },
    { path: '/inventory/approval-pb', title: 'Approval Pemakaian Barang', icon: 'material-icons' },
    { path: '/inventory/item', title: 'Item', icon: 'material-icons' },
    { path: '/inventory/transaksi', title: 'Transaksi Inventori', icon: 'material-icons' },
    { path: '/inventory/laporan', title: 'Laporan Inventory', icon: 'material-icons' },
    { path: '/asset/lokasi', title: 'Lokasi Asset', icon: 'material-icons' },
    { path: '/asset/tipe', title: 'Tipe Asset', icon: 'material-icons' },
    { path: '/asset/kategori', title: 'Kategori Asset', icon: 'material-icons' },
    { path: '/asset/daftar-asset', title: 'Daftar Asset', icon: 'material-icons' },
    { path: '/asset/laporan', title: 'Laporan Asset', icon: 'material-icons' },
    { path: '/perpustakaan/daftar-buku', title: 'Daftar Buku', icon: 'material-icons' },
    { path: '/perpustakaan/penulis', title: 'Penulis', icon: 'material-icons' },
    { path: '/perpustakaan/penerbit', title: 'Penerbit', icon: 'material-icons' },
    { path: '/perpustakaan/peminjaman-buku', title: 'Peminjaman Buku', icon: 'material-icons' },
    { path: '/perpustakaan/pengembalian-buku', title: 'Pengembalian Buku', icon: 'material-icons' },

    { path: '/pages/timeline', title: 'Timeline Page', icon:'material-icons' },
    { path: '/pages/user', title: 'User Page', icon:'material-icons' },

    { path: '/components/buttons', title: 'Buttons', icon:'pe-7s-plugin' },
    { path: '/components/grid', title: 'Grid System', icon:'pe-7s-plugin' },
    { path: '/components/panels', title: 'Panels', icon:'pe-7s-plugin' },
    { path: '/components/sweet-alert', title: 'Sweet Alert', icon:'pe-7s-plugin' },
    { path: '/components/notifications', title: 'Notifications', icon:'pe-7s-plugin' },
    { path: '/components/icons', title: 'Icons', icon:'pe-7s-plugin' },
    { path: '/components/typography', title: 'Typography', icon:'pe-7s-plugin' },

    { path: '/forms/regular', title: 'Regular Forms', icon:'pe-7s-note2' },
    { path: '/forms/extended', title: 'Extended Forms', icon:'pe-7s-note2' },
    { path: '/forms/validation', title: 'Validation Forms', icon:'pe-7s-note2' },
    { path: '/forms/wizard', title: 'Wizard', icon:'pe-7s-note2' },

    { path: '/tables/regular', title: 'Regular Tables', icon:'pe-7s-news-paper' },
    { path: '/tables/extended', title: 'Extended Tables', icon:'pe-7s-news-paper' },
    { path: '/tables/datatables.net', title: 'DataTables.net', icon:'pe-7s-news-paper' },

    { path: '/maps/google', title: 'Google Maps', icon:'pe-7s-map-marker' },
    { path: '/maps/fullscreen', title: 'Full Screen Map', icon:'pe-7s-map-marker' },
    { path: '/maps/vector', title: 'Vector Map', icon:'pe-7s-map-marker' },

    { path: '/widgets', title: 'Widgets', icon:'material-icons' },

    { path: '/charts', title: 'Charts', icon:'material-icons' },

    { path: '/calendar', title: 'Calendar', icon:'material-icons' },

    { path: '/auth/pricing', title: 'Pricing', icon:'material-icons' },
    { path: '/auth/login', title: 'Login Page', icon:'material-icons' },
    { path: '/auth/register', title: 'Register Page', icon:'material-icons' },
    { path: '/auth/lock', title: 'Lock Screen Page', icon:'material-icons' },




];
export const  menus = [
  {'name': 'MENU',
    'icon': 'dashboard',
    'link': false,
    'open': false,
    'roleId':'',
    'sub': [
             {
                 'id': '1',
                 'name': 'Dashboard',
                 'icon': 'dashboard',
                 'link': false,
                 'open': false,
                 'sub': [
                     {
                      'id': '2',
                         'name': 'Dashboard Menu',
                         'link': '/auth/dashboard',
                         'icon': 'dashboard',
                         'chip': false,
                         'open': true,
                     }
                 ]
             },
             {
              'id': '3',
              'name': 'Analysis Rule',
              'icon': 'list',
              'link': false,
              'open': false,

              'sub': [
                  {
                    'id': '4',
                    'name': 'Analysis Header',
                      'icon': 'filter_list',
                      'link': false,
                      'open': false,
                      'sub': [
                        {
                          'id': '5',
                          'name': 'Analysis Rule Detail',
                            'icon': 'filter_list',
                            'link': 'analysis-rules/analysis-rulesy',
                            'open': false,
                            'action':[
                                {'name':'new'},{'name':'edit'},{'name':'delete'},{'name':'view'}]
                        }
                    ]
                  }
              ]
          }
         ]
     }
 ];
