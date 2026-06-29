import { Component, OnInit, AfterViewInit, ViewChild, HostListener, TemplateRef } from '@angular/core';
import { TableData } from '../md/md-table/md-table.component';

import { SERVER_API_URL, SERVER_PATH_URL } from 'src/app/app.constants';
import { HttpClient } from '@angular/common/http';
import * as Chartist from 'chartist';
import ChartistTooltip from 'chartist-plugin-tooltips-updated';
// import * as ChartistLegend from 'chartist-plugin-legend';
import * as ChartistPointLabels from 'chartist-plugin-pointlabels';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';

export class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

// export var single = [
//   {
//     "name": "Tangki I",
//     "value": 1000,
//     "min":0,
//     "max":2000
//   },
//   {
//     "name": "Tangki II",
//     "value": 3000
//   },
//   {
//     "name": "Tangki III",
//     "value": 1000
//   },

// ];

declare var $: any;
import { ActivatedRoute, ActivationStart, Router, RouterOutlet } from '@angular/router';
import { AuthenticationService } from '../shared/services/authentication.service';
import { DashboardService } from '../shared/services/dashboard.service';
import PerfectScrollbar from 'perfect-scrollbar';
import { formatDate } from '@angular/common';
import { isArray } from 'util';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, AfterViewInit {
  // constructor(private navbarTitleService: NavbarTitleService, private notificationService: NotificationService) { }
  multi = [
    {
      "name": "Afdeling I",
      "series": [
        {
          "name": "panen",
          "value": 7300000
        },
        {
          "name": "pemeliharaan",
          "value": 8940000
        }
      ]
    },

    {
      "name": "Afdeling 2",
      "series": [
        {
          "name": "panen",
          "value": 7870000
        },
        {
          "name": "pemeliharaan",
          "value": 8270000
        }
      ]
    },

    {
      "name": "Afdeling 3",
      "series": [
        {
          "name": "panen",
          "value": 5000002
        },
        {
          "name": "pemeliharaan",
          "value": 5800000
        }
      ]
    }
  ];

  single = [
    {
      "name": "Tangki I",
      "value": 1000,
      "min": 0,
      "max": 2000
    },
    // {
    //   "name": "Tangki II",
    //   "value": 3000
    // },
    // {
    //   "name": "Tangki III",
    //   "value": 1000
    // },

  ];
  public tableDataTugas: TableData;
  public tableDataMateri: TableData;
  private apiUrl = SERVER_API_URL;

  pilihanBulan = [{
    id: "01",
    nama: "Januari",

  }, {
    id: "02",
    nama: "Februari",

  }, {
    id: "03",
    nama: "Maret",

  }, {
    id: "04",
    nama: "April",

  }, {
    id: "05",
    nama: "Mei",

  }, {
    id: "06",
    nama: "Juni",

  }, {
    id: "07",
    nama: "Juli",

  }, {
    id: "08",
    nama: "Agustus",

  }, {
    id: "09",
    nama: "September",

  }, {
    id: "10",
    nama: "Oktober",

  }, {
    id: "11",
    nama: "November",

  }, {
    id: "12",
    nama: "Desember",

  }
  ];
  pilihanTahun = [{
    id: "2022",
    nama: "2022",

  }, {
    id: "2023",
    nama: "2023",

  }, {
    id: "2024",
    nama: "2024",

  }, {
    id: "2025",
    nama: "2025",

  }, {
    id: "2026",
    nama: "2026",

  }
  ];
  selectedBulan;
  selectedTahun;
  pengumuman = [];
  @ViewChild(RouterOutlet, { static: true }) outlet: RouterOutlet;
  dbName;
  pathName;
  PATH_URL;
  auth;
  jumKaryawan = 0;
  param_bulan = 'bulan_ini';
  tangkiChart = [];
  penerimaanTBSHarian = [];

  karyawan = [];
  totalKaryawan = 0;

  view: any[] = [400, 250];
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#2596BE']
  };

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = true;
  legend: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Tanggal';
  yAxisLabel: string = 'Janjang';
  yAxisLabelTbsOlah: string = 'Ton'
  yAxisLabelPnerimaanTbsBySupp: string = 'Ton'
  timeline: boolean = true;
  view2: any[] = [1000, 300];
  colorScheme2 = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };
  modalRef: BsModalRef;
  legendPosition: string = 'below';
  pengirimanCPOHarian: any[];
  panenHarian: any[];
  CurahHujanHarian: any[];
  tbsOlah: any[];
  penerimaanTbsbySupp: any[];
  panenPerbulan: any[];
  // colorScheme = {
  //   domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  // };
  // colorScheme = {
  //   domain: ['#5AA454', '#C7B42C']
  // };

  showXAxis = true;
  showYAxis = true;
  yAxisLabelCurahHujan = 'mili meter';

  xAxisLabelPanenPerbulan = 'Afdeling';
  showYAxisLabelPanenPerbulan = true;
  yAxisLabelPanenPerbulan = 'Ton';
  viewPanenPerbulan: any[] = [700, 400];

  xAxisLabelAllHkAfdeling = 'Afdeling';
  showYAxisLabelAllHkAfdeling = true;
  yAxisLabelAllHkAfdeling = 'HK';
  viewAllHkAfdeling: any[] = [1000, 400];



  yAxisLabelHKPanenPerbulan = 'HK';
  viewHKPanenPerbulan: any[] = [500, 400];

  yAxisLabelPemeliharaanPerbulan = 'HK';
  viewHKPemeliharaanPerbulan: any[] = [500, 400];

  viewPemakaianSolarPerbulan: any[] = [1000, 400];
  viewGauge: any[] = [300, 200];
  viewKaryawan: any[] = [500, 400];
  pemakaianSolar: any[];
  hkpanenPerbulan: any;
  hkpemeliharaanPerbulan: any;
  hkAllAfdelingPerbulan: any[];
  dashboardSetting: any[];

    @ViewChild('announcementTemplate', { static: false })
  announcementTemplate: TemplateRef<any>;
  // colorScheme = {
  //   domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  // };
  // colorScheme = {
  //   domain: ['#5AA454', '#C7B42C']
  // };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private dashboardService: DashboardService,
    private authenticationService: AuthenticationService,
    private modalService: BsModalService
  ) {

    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;

    this.auth = this.authenticationService.getUserProfile();
    // Object.assign(this, { single });
    // const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
    // const elemSidebar = <HTMLElement>document.querySelector('.sidebar-wrapper');

    // setTimeout(() => {
    //   let ps = new PerfectScrollbar(elemMainPanel);
    //   ps.update();
    //   // let ps2 = new PerfectScrollbar(elemSidebar);
    //   // ps2.update();

    // }, 2000);
    // setTimeout(() => {

    //   let ps2 = new PerfectScrollbar(elemSidebar);
    //   ps2.update();

    // }, 3000);


  }
  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
  detailPengumuman(id: number) {
    this.router.navigate(['pengumuman-detail', id.toString(), { previousUrl: this.router.url }]);

  }
  startAnimationForLineChart(chart) {
    var seq, delays, durations;
    seq = 0;
    delays = 80;
    durations = 500;
    chart.on('draw', function (data) {

      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq = 0;
  }
  startAnimationForBarChart(chart) {
    var seq2, delays2, durations2;
    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function (data) {
      if (data.type === 'bar') {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
      var barHorizontalCenter, barVerticalCenter, label, value;
      if (data.type === "bar") {
        barHorizontalCenter = data.x1 + (data.element.width() * .5) + 20;
        barVerticalCenter = data.y1 + (data.element.height() * -1) - 10;
        value = data.element.attr('ct:value');
        if (value !== '0') {
          label = new Chartist.Svg('text');
          label.text(value);
          label.addClass("ct-barlabel");
          label.attr({
            x: barHorizontalCenter,
            y: barVerticalCenter,
            'text-anchor': 'middle'
          });
          return data.group.append(label);
        }
      }
    });


    seq2 = 0;
  }
  // constructor(private navbarTitleService: NavbarTitleService) { }

  loadData() {
    // console.log(this.auth);
    this.tableDataTugas = {
      headerRow: [],
      dataRows: [

      ]
    };
    this.tableDataMateri = {
      headerRow: [],
      dataRows: [

      ]
    };
    this.dashboardService.getPksStokTangki().subscribe(data => {
      console.log(data);

      this.tangkiChart = []; // reset biar tidak numpuk

      data.forEach(el => {
        if (el) {
          let x = {
            kapasitas: parseFloat(el['kapasitas'] || 0),
            nama_tanki: el['nama_tanki'] || '-',
            stok: el['stok'] != null ? parseFloat(el['stok']).toFixed(0) : 0
          };
          this.tangkiChart.push(x);
        }
      });

      if (this.tangkiChart.length > 0) {
        this.setChart();
      }
    });


    this.dashboardService.getPksPenerimaanTBSHarian(this.param_bulan).subscribe(data => {
      this.penerimaanTBSHarian = data;
      this.setChart();
    });
    this.dashboardService.getPksPengirimanCPOSHarian(this.param_bulan).subscribe(data => {
      this.pengirimanCPOHarian = data;
      this.setChart();
    });
    this.dashboardService.getPanenHarian(this.param_bulan).subscribe(data => {
      this.panenHarian = data;
      // console.log(data);

    });
    this.dashboardService.getCurahHujanHarian(this.param_bulan).subscribe(data => {
      this.CurahHujanHarian = data;
      // console.log(data);

    });
    this.dashboardService.getPemakaianSolarPerbulan(this.param_bulan).subscribe(data => {
      this.pemakaianSolar = data;
      // console.log(data);

    });
    this.dashboardService.getTbsOlah(this.param_bulan).subscribe(data => {
      this.tbsOlah = data;
      // console.log(data);

    });
    this.dashboardService.getPenerimaanTbsBySupp(this.param_bulan).subscribe(data => {
      this.penerimaanTbsbySupp = data;
      console.log(data);

    });
    this.dashboardService.geJumlahKaryawan().subscribe(data => {
      // console.log(data)
      this.totalKaryawan = 0;
      this.karyawan = data;
      data.forEach(element => {
        this.totalKaryawan = this.totalKaryawan + parseInt(element['value'])

      });
      this.setChart();
    });
    this.dashboardService.getPanenPerbulan(this.param_bulan).subscribe(data => {
      this.panenPerbulan = data;
      // console.log(data);

    });
    this.dashboardService.getHkPanenPerbulan(this.param_bulan).subscribe(data => {
      this.hkpanenPerbulan = data;
      // console.log(data);

    });
    this.dashboardService.getHkPemeliharaanPerbulan(this.param_bulan).subscribe(data => {
      this.hkpemeliharaanPerbulan = data;
      // console.log(data);

    });
    this.dashboardService.getHkAllAfdelingPerbulan(this.param_bulan).subscribe(data => {
      this.hkAllAfdelingPerbulan = data;
      //  console.log(data);
      //  console.log(this.multi)

    });
  }

  setChart() {

    /* ----------==========     Daily Sales Chart initialization    ==========---------- */
    // console.log(this.penerimaanTBSHarian);
    var dataPenerimaanTBSHarian = {
      labels: this.penerimaanTBSHarian.map(m => { return m['tgl'] }),
      series: [
        this.penerimaanTBSHarian.map(m => { return (m['beratkg'] / 1000).toFixed(0) })
      ]
    };

    var optionsPenerimaanTBSHarian = {
      plugins: [
        ChartistPointLabels({
          textAnchor: 'middle'
        }),
        ChartistTooltip({
          appendToBody: true,
          pointClass: 'my-cool-point'
        })
      ],
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      axisX: {
        offset: 70 //Insert here your axisX offset and play with the values
      },
      axisY: {
        offset: 55 //Insert here your axisY offset and play with the values
      },
      low: 0,
      high: 1400, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
      // plugins: [
      //   ChartistTooltip()
      // ]
    }

    var PenerimaanTBSHarian = new Chartist.Line('#PenerimaanTBSHarian', dataPenerimaanTBSHarian, optionsPenerimaanTBSHarian);

    let highValuePengirimanCpo = 1000; // default, untuk jaga-jaga kalau datanya kosong
    if (this.pengirimanCPOHarian && this.pengirimanCPOHarian.length > 0) {
      const seriesData = this.pengirimanCPOHarian.map(m => +(m['beratkg'] / 1000).toFixed(0));

      let maxValue = Math.max(...seriesData);

      // kalau hasil max 0 atau NaN/null -> tetap pakai 1000
      if (!maxValue || maxValue <= 0) {
        maxValue = 1000;
      }

      const padding = Math.ceil(maxValue * 0.25);
      highValuePengirimanCpo = maxValue + padding;

      var dataPengirimanCPOHarian = {
        labels: this.pengirimanCPOHarian.map(m => m['tgl']),
        series: [seriesData]
      };
    }


    var optionsPengirimanCPOHarian = {
      plugins: [
        ChartistPointLabels({
          textAnchor: 'middle'
        })
      ],
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      axisX: {
        offset: 70 //Insert here your axisX offset and play with the values
      },
      axisY: {
        offset: 55 //Insert here your axisY offset and play with the values
      },
      low: 0,
      high: highValuePengirimanCpo, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },

    }

    var PengirimanCPOHarian = new Chartist.Line('#PengirimanCPOHarian', dataPengirimanCPOHarian, optionsPengirimanCPOHarian);

    // console.log(this.panenHarian);
    //  this.panenHarian = [
    //   {
    //     "name": "Germany",
    //     "series": [
    //       {
    //         "name": "1990",
    //         "value": 62000000
    //       },
    //       {
    //         "name": "2010",
    //         "value": 73000000
    //       },
    //       {
    //         "name": "2011",
    //         "value": 89400000
    //       }
    //     ]
    //   },

    //   {
    //     "name": "USA",
    //     "series": [
    //       {
    //         "name": "1990",
    //         "value": 250000000
    //       },
    //       {
    //         "name": "2010",
    //         "value": 309000000
    //       },
    //       {
    //         "name": "2011",
    //         "value": 311000000
    //       }
    //     ]
    //   },

    //   {
    //     "name": "France",
    //     "series": [
    //       {
    //         "name": "1990",
    //         "value": 58000000
    //       },
    //       {
    //         "name": "2010",
    //         "value": 50000020
    //       },
    //       {
    //         "name": "2011",
    //         "value": 58000000
    //       }
    //     ]
    //   },
    //   {
    //     "name": "UK",
    //     "series": [
    //       {
    //         "name": "1990",
    //         "value": 57000000
    //       },
    //       {
    //         "name": "2010",
    //         "value": 62000000
    //       }
    //     ]
    //   }
    // ];
    // let t = this.panenHarian['tanggal']
    // let d1 = this.panenHarian['detail']['AFDELING 01 - SBME'];
    // let d2 = this.panenHarian['detail']['AFDELING 01 - SBNE'];
    // let d3 = this.panenHarian['detail']['AFDELING 02 - SBME'];
    // let d4 = this.panenHarian['detail']['AFDELING 02 - SBNE'];
    // let d5 = this.panenHarian['detail']['AFDELING 03 - SBNE'];
    // let d6 = this.panenHarian['detail']['AFDELING 04 - SBNE'];
    // var dataPanenHarian = {
    //   labels: t,
    //   series: [
    //     d1, d2, d3, d4, d5, d6
    //   ]
    // };

    // var optionsPanenHarian = {
    //   lineSmooth: Chartist.Interpolation.cardinal({
    //     tension: 100
    //   }),
    //   axisX: {
    //     offset: 70 //Insert here your axisX offset and play with the values
    //   },
    //   axisY: {
    //     offset: 55 //Insert here your axisY offset and play with the values
    //   },
    //   low: 0,
    //   high: 10000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
    //   chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
    //   // plugins: [
    //   //   ChartistTooltip()
    //   // ]
    //   plugins: [
    //     ChartistLegend( {position:'bottom',
    //       legendNames: ['AFDELING 01 - SBME', 'AFDELING 01 - SBNE', 'AFDELING 02 - SBME','AFDELING 02 - SBNE','AFDELING 03 - SBNE','AFDELING 04 - SBNE'],
    //   })
    //    //  Chartist.plugins.legend()
    //   ]
    // }

    // var PanenHarian = new Chartist.Line('#PanenHarian', dataPanenHarian, optionsPanenHarian);


    this.startAnimationForLineChart(PenerimaanTBSHarian);
    this.startAnimationForLineChart(PengirimanCPOHarian);



    var datatangkiChart = {
      labels: this.tangkiChart.map(k => { return k['kode_tanki'] }),
      series: [
        this.tangkiChart.map(k => { return (k['stok'] / 1000).toFixed(2) })

      ]
    };
    var optionstangkiChart = {
      axisX: {
        showGrid: false
      },
      low: 0,
      high: 2500,
      chartPadding: { top: 0, right: 5, bottom: 0, left: 0 },
      // plugins: [
      //   ChartistTooltip()
      // ]
    };
    var responsiveOptions: any = [
      ['screen and (max-width: 740px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }]
    ];

    // if (datatangkiChart) {
    //   var tangkiChart = new Chartist.Bar('#tangkiChart', datatangkiChart, optionstangkiChart, responsiveOptions);

    //   this.startAnimationForBarChart(tangkiChart);
    // }

    // var mapData = {
    //   "AU": 760,
    //   "BR": 550,
    //   "CA": 120,
    //   "DE": 1300,
    //   "FR": 540,
    //   "GB": 690,
    //   "GE": 200,
    //   "IN": 200,
    //   "RO": 600,
    //   "RU": 300,
    //   "US": 2920,
    // };
    // $('#worldMap').vectorMap({
    //   map: 'world_mill_en',
    //   backgroundColor: "transparent",
    //   zoomOnScroll: false,
    //   regionStyle: {
    //     initial: {
    //       fill: '#e4e4e4',
    //       "fill-opacity": 0.9,
    //       stroke: 'none',
    //       "stroke-width": 0,
    //       "stroke-opacity": 0
    //     }
    //   },

    //   series: {
    //     regions: [{
    //       values: mapData,
    //       scale: ["#AAAAAA", "#444444"],
    //       normalizeFunction: 'polynomial'
    //     }]
    //   },
    // });
  }

  public ngOnInit() {

    let hariini: Date = new Date();
    let bulan = formatDate(hariini, "MM", "en_US");
    let tahun = formatDate(hariini, "yyyy", "en_US");

    this.pilihanBulan.forEach(el => {
      if (el['id'] == bulan) {
        this.selectedBulan = el;
      }

    });
    this.pilihanTahun.forEach(el => {

      if (el['id'] == tahun) {
        this.selectedTahun = el;
      }

    });

    // this.loadData();
    this.updateChartViews();
  }

  isShow(kodeSection) {

    var is_show = false;
    if (isArray(this.dashboardSetting)) {
      this.dashboardSetting.forEach(el => {
        if (el['kode'] == kodeSection) {
          if (el['is_show'] == '1') {
            is_show = true;
          }
        }
      });
    }
    //  if (kodeSection=='PKS_PENERIMAAN_TBS_01'||kodeSection=='PKS_PENGIRIMAN_CPO'){
    //    this.setChart();
    //  }

    return is_show;

  }
  ngAfterViewInit() {
    this.dashboardService.getDashboardSetting().subscribe(d => {
      this.dashboardSetting = d;
      console.log(this.dashboardSetting);
      this.checkAnnouncement2026();
      this.loadData();
    })

    var breakCards = true;
    if (breakCards == true) {
      // We break the cards headers if there is too much stress on them :-)
      $('[data-header-animation="true"]').each(function () {
        var $fix_button = $(this);
        var $card = $(this).parent('.card');
        $card.find('.fix-broken-card').click(function () {
          //  console.log(this);
          var $header = $(this).parent().parent().siblings('.card-header, .card-image');
          $header.removeClass('hinge').addClass('fadeInDown');

          $card.attr('data-count', 0);

          setTimeout(function () {
            $header.removeClass('fadeInDown animate');
          }, 480);
        });

        $card.mouseenter(function () {
          var $this = $(this);
          var hover_count = parseInt($this.attr('data-count'), 10) + 1 || 0;
          $this.attr("data-count", hover_count);
          if (hover_count >= 20) {
            $(this).children('.card-header, .card-image').addClass('hinge animated');
          }
        });
      });
    }
    //  Activate the tooltips
    $('[rel="tooltip"]').tooltip();

    //   var $tooltip = $('<div class="tooltipchart tooltipchart-hidden"></div>').appendTo($('.ct-chart'));

    //   $(document).on('mouseenter', '.ct-point', function () {
    //     var seriesName = $(this).closest('.ct-series').attr('ct:series-name'),
    //       value = $(this).attr('ct:value');

    //     $tooltip.text(seriesName + ': ' + value);
    //     $tooltip.removeClass('tooltipchart-hidden');
    //     console.log(seriesName + ': ' + value);
    //   });

    //   $(document).on('mouseleave', '.ct-point', function () {
    //     $tooltip.addClass('tooltipchart-hidden');
    //   });

    //   $(document).on('mousemove', '.ct-point', function (event) {
    //     $tooltip.css({
    //       left: event.offsetX - $tooltip.width() / 2,
    //       top: event.offsetY - $tooltip.height() - 20
    //     });
    //   });
  }
  getDataBulanIni() {
    console.log('bulan ini')
    this.param_bulan = 'bulan_ini'
    this.loadData();

  }
  getDataBulanLalu() {
    console.log('bulan lalu')
    this.param_bulan = 'bulan_lalu'
    this.loadData();


  }
  onChangeBulan(changedDropdown: string) {
    console.log(this.selectedBulan);
    console.log(changedDropdown);
    this.param_bulan = this.selectedTahun['id'] + '-' + this.selectedBulan['id'];
    console.log(this.param_bulan);
    this.loadData();
  }

  updateChartViews() {
    const width = window.innerWidth;

    if (width <= 480) {
      // 📱 HP
      this.view = [width - 80, 260];
      this.view2 = [width - 80, 260];
      this.viewPanenPerbulan = [width - 80, 260];
      this.viewPemakaianSolarPerbulan = [width - 80, 260];
      this.viewAllHkAfdeling = [width - 95, 260];
      this.viewHKPanenPerbulan = [width - 95, 260];
      this.viewHKPemeliharaanPerbulan = [width - 95, 260];
      this.viewGauge = [width - 100, 200];
      this.viewKaryawan = [width - 100, 260];

      this.legendPosition = 'below'; // 🔽 legend di bawah untuk HP
    } else if (width <= 768) {
      // 💻 Tablet
      this.view = [width - 100, 300];
      this.view2 = [width - 100, 300];
      this.viewPanenPerbulan = [width - 100, 300];
      this.viewPemakaianSolarPerbulan = [width - 100, 300];
      this.viewAllHkAfdeling = [width - 100, 300];
      this.viewHKPanenPerbulan = [width - 100, 300];
      this.viewHKPemeliharaanPerbulan = [width - 100, 300];
      this.viewGauge = [width - 120, 220];
      this.viewKaryawan = [width - 120, 300];

      this.legendPosition = 'below'; // 🔽 legend di bawah
    } else {
      // 🖥️ Desktop
      this.view = [400, 250];
      this.view2 = [1000, 300];
      this.viewPanenPerbulan = [700, 400];
      this.viewPemakaianSolarPerbulan = [1000, 400];
      this.viewAllHkAfdeling = [1000, 400];
      this.viewHKPanenPerbulan = [500, 400];
      this.viewHKPemeliharaanPerbulan = [500, 400];
      this.viewGauge = [300, 200];
      this.viewKaryawan = [500, 400];

      this.legendPosition = 'right'; // 🧭 legend di kanan untuk desktop
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateChartViews();
  }

  //   checkAnnouncement2026() {
  //   const today = new Date();
  //   const startDate = new Date(2025, 11, 30); // 30 Des 2025

  //   const todayStr = this.getTodayString();
  //   const seenDate = localStorage.getItem('announcement_2026_seen_date');

  //   // belum waktunya
  //   if (today < startDate) {
  //     return;
  //   }

  //   // belum pernah klik "Saya Mengerti"
  //   if (!seenDate) {
  //     this.showAnnouncement();
  //     return;
  //   }

  //   // hari sudah berganti → reset otomatis
  //   if (seenDate !== todayStr) {
  //     localStorage.removeItem('announcement_2026_seen_date');
  //     this.showAnnouncement();
  //   }
  // }

  checkAnnouncement2026() {
  return; // 🔕 announcement dimatikan
}


  showAnnouncement() {
    // if (!this.announcementTemplate) {
    //   return;
    // }

    // this.modalRef = this.modalService.show(
    //   this.announcementTemplate,
    //   {
    //     class: 'modal-lg',
    //     backdrop: 'static',
    //     keyboard: false
    //   }
    // );
  }


  closeAnnouncement() {
    // localStorage.setItem('announcement_2026_seen', '1');
    // if (this.modalRef) {
    //   this.modalRef.hide();
    // }
  }



  getTodayString(): string {
    const d = new Date();

    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);

    return year + '-' + month + '-' + day;
  }

}
