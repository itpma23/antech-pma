import { Component, OnInit, Renderer, ViewChild, ElementRef, Directive, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ROUTES } from '../.././sidebar/sidebar-routes.config';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AuthenticationService } from '../services/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { DashboardService } from '../services/dashboard.service';
import { PrcPpService } from '../services/prc_pp.service';
import { Observable } from 'rxjs/internal/Observable';
import { timer } from 'rxjs';
import { NotifCountService } from '../services/notifCount.service';
import { PrcPoService } from '../services/prc_po.service';
import { HrmsPengajuanCutiService } from '../services/hrms_pengajuan_cuti.service';
import { InvPemakaianBarangOnlineService } from '../services/inv_pemakaian_barang_online.service';
var misc: any = {
  navbar_menu_visible: 0,
  active_collapse: true,
  disabled_collapse_init: 0,
}
declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'navbar-cmp',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NavbarComponent implements OnInit {
  private listTitles: any[];
  location: Location;
  private nativeElement: Node;
  private toggleButton;
  private sidebarVisible: boolean;
  auth;
  translations: any;
  selectedLanguage: string = 'id';

  @ViewChild("navbar-cmp", { static: true }) button;
  namaCompany: string;
  jumApprovalPP: number = 0;
  jumApprovalPB: number = 0;
  totalNotif: number = 0;
  timer: any;
  jumApprovalPO: number = 0;
  jumApprovalPPReady: number = 0;
  jumApprovalCuti: number = 0;

  constructor(location: Location, private renderer: Renderer2, private element: ElementRef,
    private authenticationService: AuthenticationService,
    private dashboardService: DashboardService,
    public translate: TranslateService,
    private prcPpService: PrcPpService,
    private prcPoService: PrcPoService,
    private hrmsPengajuanCutiService: HrmsPengajuanCutiService,
    private invPemakaianBarangService: InvPemakaianBarangOnlineService,
    private notifCountService: NotifCountService,private cd: ChangeDetectorRef
    
  ) {
    this.location = location;
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
    this.auth = this.authenticationService.getUserProfile();
    this.namaCompany = this.authenticationService.getUserCompanyName();
    // console.log(this.auth);

  }
  logout() {
    console.log('logout 1');
    this.authenticationService.logout();

  }
  ngOnInit() {
    this.notifCountService.listenMessage.subscribe(message =>
      this.getNotif()
    )
    this.listTitles = ROUTES.filter(listTitle => listTitle);

    var navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
    if ($('body').hasClass('sidebar-mini')) {
      misc.sidebar_mini_active = true;
    }
    $('#minimizeSidebar').click(function () {
      var $btn = $(this);

      if (misc.sidebar_mini_active == true) {
        $('body').removeClass('sidebar-mini');
        misc.sidebar_mini_active = false;

      } else {
        setTimeout(function () {
          $('body').addClass('sidebar-mini');

          misc.sidebar_mini_active = true;
        }, 300);
      }

      // we simulate the window Resize so the charts will get updated in realtime.
      var simulateWindowResize = setInterval(function () {
        window.dispatchEvent(new Event('resize'));
      }, 180);

      // we stop the simulation of Window Resize after the animations are completed
      setTimeout(function () {
        clearInterval(simulateWindowResize);
      }, 1000);
    });

    this.timer = timer(1000, 120000);
    this.timer.subscribe((t) => this.getNotif());

    if (this.hasNotification()) {
      this.sidebarToggle(); // buka otomatis
    }


  }
  isMobileMenu() {
    if ($(window).width() < 991) {
      return false;
    }
    return true;
  }
  sidebarToggle() {
    var toggleButton = this.toggleButton;
    var body = document.getElementsByTagName('body')[0];

    if (this.sidebarVisible == false) {
      setTimeout(function () {
        toggleButton.classList.add('toggled');
      }, 500);
      body.classList.add('nav-open');
      this.sidebarVisible = true;
    } else {
      this.toggleButton.classList.remove('toggled');
      this.sidebarVisible = false;
      body.classList.remove('nav-open');
    }
  }
  // Untuk menampilkan judul berdasarkan URL
  getMenuTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = '/' + titlee.slice(2);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    // return 'Dashboard';
    return '';
  }
  getTitle() {

    return this.namaCompany;
  }
  getPath() {
    // console.log(this.location);
    return this.location.prepareExternalUrl(this.location.path());
  }
  changeLanguage(language: string) {
    this.translate.use(language);
    this.changeLocale(language);
  }

  changeLocale(locale: string) {
    this.selectedLanguage = locale;
    //this.userService.changeLocale(locale).subscribe(data => {});
  }

  getNotif() {
    this.auth = this.authenticationService.getUserProfile();
    // console.log(this.auth);
    if (this.auth) {
      console.log('Notif');
      this.prcPpService.countApproveData().subscribe(pp => {
        console.log('PP:' + pp['data']['jumlah'])
        this.jumApprovalPP = parseFloat(pp['data']['jumlah']);
        this.totalNotif = this.jumApprovalPO + this.jumApprovalPP + this.jumApprovalPPReady + this.jumApprovalCuti + this.jumApprovalPB;
        this.cd.markForCheck();  // <-- tambahkan ini
      });
      this.prcPoService.countApproveData().subscribe(po => {
        console.log('PO:' + po['data']['jumlah'])
        this.jumApprovalPO = parseFloat(po['data']['jumlah']);
        this.totalNotif = this.jumApprovalPO + this.jumApprovalPP + this.jumApprovalPPReady + this.jumApprovalCuti + this.jumApprovalPB;
        this.cd.markForCheck();  // <-- tambahkan ini
      });
      this.prcPpService.countPPReadyPO().subscribe(pp => {
        console.log('PP ready:' + pp['data']['jumlah'])
        this.jumApprovalPPReady = parseFloat(pp['data']['jumlah']);
        this.totalNotif = this.jumApprovalPO + this.jumApprovalPP + this.jumApprovalPPReady + this.jumApprovalCuti + this.jumApprovalPB;
        this.cd.markForCheck();  // <-- tambahkan ini
      });
      this.hrmsPengajuanCutiService.countApproveData().subscribe(ct => {
        console.log('CUti:' + ct['data']['jumlah'])
        this.jumApprovalCuti = parseFloat(ct['data']['jumlah']);
        this.totalNotif = this.jumApprovalPO + this.jumApprovalPP + this.jumApprovalPPReady + this.jumApprovalCuti + this.jumApprovalPB;
        this.cd.markForCheck();  // <-- tambahkan ini
      });

      this.invPemakaianBarangService.countApproveData().subscribe(pb => {
        console.log('PB:' + pb['data']['jumlah'])
        this.jumApprovalPB = parseFloat(pb['data']['jumlah']);
        this.totalNotif = this.jumApprovalPO + this.jumApprovalPP + this.jumApprovalPPReady + this.jumApprovalCuti + this.jumApprovalPB;
        this.cd.markForCheck();  // <-- tambahkan ini
      });

    }
  }

  hasNotification(): boolean {
    return this.jumApprovalPP > 0 ||
      this.jumApprovalPB > 0 ||
      this.jumApprovalPO > 0 ||
      this.jumApprovalPPReady > 0 ||
      this.jumApprovalCuti > 0;
  }

}
