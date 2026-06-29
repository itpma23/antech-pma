import { Component, OnInit, AfterViewInit, AfterViewChecked, AfterContentInit } from '@angular/core';
import { ROUTES } from './sidebar-routes.config';
import { menus } from './sidebar-routes.config';
import PerfectScrollbar from 'perfect-scrollbar';
import { AuthenticationService } from '../shared/services/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { SERVER_PATH_URL } from '../app.constants';
import { NgxPermissionsService } from 'ngx-permissions';
import { DashboardService } from '../shared/services/dashboard.service';
import { Subscription, timer } from 'rxjs';
import { PrcPpService } from '../shared/services/prc_pp.service';
import { PrcPoService } from '../shared/services/prc_po.service';
import { NotifCountService } from '../shared/services/notifCount.service';
import { HrmsPengajuanCuti } from '../shared/models/hrms_pengajuan_cuti.model';
import { HrmsPengajuanCutiService } from '../shared/services/hrms_pengajuan_cuti.service';
import { InvPemakaianBarangOnlineService } from '../shared/services/inv_pemakaian_barang_online.service';
// import * as $ from "jquery";
declare var $: any;

var sidebarTimer;

@Component({
  moduleId: module.id,
  selector: 'sidebar-cmp',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.css']
})

export class SidebarComponent implements OnInit {
  public menuItems: any[];
  data: any;
  auth: any;
  jumApprovalPP: number = 0;
  jumApprovalPB: number = 0;
  totalNotif: number = 0;
  timer: any;
  jumApprovalPO: number = 0;
  menuData = menus[0]['sub'];
  jumApprovalPPReady: number = 0;
  jumApprovalCuti: number=0;
  isNotMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
  dbName;
  pathName;
  PATH_URL;
  roles;
  namaCompany = "ERP";
  logoCompany = "";
  awalan = "menu";
  elemSidebar;
  ps: PerfectScrollbar;
  countDown: Subscription;
  constructor(private authenticationService: AuthenticationService,
    private dashboardService: DashboardService,
    private translate: TranslateService, private permissions: NgxPermissionsService,
    private prcPpService: PrcPpService,
    private prcPoService: PrcPoService,
    private hrmsPengajuanCutiService: HrmsPengajuanCutiService,
    private invPemakaianBarangService: InvPemakaianBarangOnlineService,
    private notifCountService: NotifCountService) {
    this.data = this.authenticationService.getUserProfile();

    this.auth = this.authenticationService.getUserProfile();
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.namaCompany = this.authenticationService.getUserCompanyName();
    this.logoCompany = this.authenticationService.getUserCompanyLogo();
    this.roles = this.authenticationService.getRoles();

    this.PATH_URL = SERVER_PATH_URL;



  }
  getNotif() {
    this.auth = this.authenticationService.getUserProfile();
    // console.log(this.auth);
    if (this.auth) {
      console.log('Notif');
      this.prcPpService.countApproveData().subscribe(pp => {
        this.jumApprovalPP = parseFloat(pp['data']['jumlah']);
        this.totalNotif = this.jumApprovalPO + this.jumApprovalPP + this.jumApprovalPPReady+this.jumApprovalCuti+ this.jumApprovalPB;

      });
      this.prcPoService.countApproveData().subscribe(po => {
        this.jumApprovalPO = parseFloat(po['data']['jumlah']);
        this.totalNotif = this.jumApprovalPO + this.jumApprovalPP + this.jumApprovalPPReady+this.jumApprovalCuti+ this.jumApprovalPB;

      });
      this.prcPpService.countPPReadyPO().subscribe(pp => {
        this.jumApprovalPPReady = parseFloat(pp['data']['jumlah']);
        this.totalNotif = this.jumApprovalPO + this.jumApprovalPP + this.jumApprovalPPReady+this.jumApprovalCuti+ this.jumApprovalPB;

      });

      this.hrmsPengajuanCutiService.countApproveData().subscribe(ct => {
        console.log('CUti:'+ct['data']['jumlah'])
        this.jumApprovalCuti = parseFloat(ct['data']['jumlah']);
        this.totalNotif = this.jumApprovalPO + this.jumApprovalPP + this.jumApprovalPPReady+this.jumApprovalCuti+ this.jumApprovalPB;

      });

    this.invPemakaianBarangService.countApproveData().subscribe(pb => {
      console.log('PB:'+pb['data']['jumlah'])
      this.jumApprovalPB = parseFloat(pb['data']['jumlah']);
      this.totalNotif = this.jumApprovalPO + this.jumApprovalPP + this.jumApprovalPPReady+this.jumApprovalCuti + this.jumApprovalPB;

    });
    }

  }
  getRouterLink(link) {
    return ["/" + link]

  }
  ngOnInit() {
    // console.log(this.menuData);
    // this.permissions.flushPermissions();
    // this.permissions.loadPermissions(this.roles);
    // console.log(this.roles);
    // this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.elemSidebar = <HTMLElement>document.querySelector('.sidebar-wrapper');
    const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
    var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

    // if (isWindows) {
    //   // if we are on windows OS we activate the perfectScrollbar function
    //   //  $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();
    //   let ps = new PerfectScrollbar(elemMainPanel);
    //   ps = new PerfectScrollbar(elemSidebar);
    //   $('html').addClass('perfect-scrollbar-on');
    // } else {
    //   $('html').addClass('perfect-scrollbar-off');
    // }

    // setTimeout(() => {


    //   this.ps = new PerfectScrollbar(this.elemSidebar);
    //   this.ps.update();


    // }, 1000);
    this.authenticationService.getMenuAccess().subscribe(d => {
      this.menuData = d['data'];
       console.log(this.menuData);
      setTimeout(() => {
        let ps = new PerfectScrollbar(this.elemSidebar);
        ps.update();

      }, 1000);

      var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
      isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
      if (isWindows) {
        // if we are on windows OS we activate the perfectScrollbar function
        // $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();
        // let ps1 = new PerfectScrollbar(elemMainPanel);
        // let ps = new PerfectScrollbar(elemSidebar);
        // ps.update();
        // $('html').addClass('perfect-scrollbar-on');
      } else {
        //$('html').addClass('perfect-scrollbar-off');
      }
    });
    this.notifCountService.listenMessage.subscribe(message =>
      this.getNotif()
    )
  }
  updateScroll() {

    setTimeout(() => {


      // this.ps = new PerfectScrollbar(this.elemSidebar);
      //  this.ps.destroy
      // this.ps.update();
      // console.log('here');


    }, 1000);
  }
  ngAfterViewInit() {
    // let interval = setInterval(() => {
    //   // console.log('here');
    //   // if (mda.movingTabInitialised == false) {
    //     console.log('here2');
    //     mda.initMovingTab();
    //     mda.movingTabInitialised = true;

    //  // }
    // },5000)
    // init Moving Tab after the view is initialisez
    setTimeout(() => {
      if (mda.movingTabInitialised == false) {
        mda.initMovingTab();
        mda.movingTabInitialised = true;
      }


    }, 4000);
    setTimeout(() => {
      console.log('here 5100' );
      mda.initMovingTab();
      mda.movingTabInitialised = true;



    }, 5100);
    setTimeout(() => {
      console.log('here 10000' );
      mda.initMovingTab();
      mda.movingTabInitialised = true;



    }, 10000);

  }

  logout() {
    console.log('logout 1');
    this.authenticationService.logout();

  }
}

// The Moving Tab (the element that is moving on the sidebar, when you switch the pages) is depended on jQuery because it is doing a lot of calculations and changes based on Bootstrap collapse elements. If you have a better suggestion please send it to hello@creative-tim.com and we would be glad to talk more about this improvement. Thank you!

var mda: any = {
  movingTab: '<div class="sidebar-moving-tab"/>',
  isChild: false,
  sidebarMenuActive: '',
  movingTabInitialised: false,
  distance: 0,

  setMovingTabPosition: function ($currentActive) {
    $currentActive = mda.sidebarMenuActive;
    mda.distance = $currentActive.parent().position().top - 10;

    if ($currentActive.closest('.collapse').length != 0) {
      var parent_distance = $currentActive.closest('.collapse').parent().position().top;
      mda.distance = mda.distance + parent_distance;
    }

    mda.moveTab();
  },
  initMovingTab: function () {
    mda.movingTab = $(mda.movingTab);

    mda.sidebarMenuActive = $('.sidebar .nav-container > .nav > li.active > a:not([data-toggle="collapse"]');

    if (mda.sidebarMenuActive.length != 0) {
      mda.setMovingTabPosition(mda.sidebarMenuActive);
    } else {
      mda.sidebarMenuActive = $('.sidebar .nav-container .nav > li.active .collapse li.active > a');
      mda.isChild = true;
      this.setParentCollapse();
    }

    mda.sidebarMenuActive.parent().addClass('visible');

    var button_text = mda.sidebarMenuActive.html();
    mda.movingTab.html(button_text);

    $('.sidebar .nav-container').append(mda.movingTab);

    if (window.history && window.history.pushState) {
      $(window).on('popstate', function () {

        setTimeout(function () {
          mda.sidebarMenuActive = $('.sidebar .nav-container .nav li.active a:not([data-toggle="collapse"])');

          if (mda.isChild == true) {
            this.setParentCollapse();
          }
          clearTimeout(sidebarTimer);

          var $currentActive = mda.sidebarMenuActive;

          $('.sidebar .nav-container .nav li').removeClass('visible');

          var $movingTab = mda.movingTab;
          $movingTab.addClass('moving');

          $movingTab.css('padding-left', $currentActive.css('padding-left'));
          var button_text = $currentActive.html();

          mda.setMovingTabPosition($currentActive);

          sidebarTimer = setTimeout(function () {
            $movingTab.removeClass('moving');
            $currentActive.parent().addClass('visible');
          }, 650);

          setTimeout(function () {
            $movingTab.html(button_text);
          }, 10);
        }, 10);

      });
    }

    $('.sidebar .nav .collapse').on('hidden.bs.collapse', function () {
      var $currentActive = mda.sidebarMenuActive;

      mda.distance = $currentActive.parent().position().top - 10;

      if ($currentActive.closest('.collapse').length != 0) {
        var parent_distance = $currentActive.closest('.collapse').parent().position().top;
        mda.distance = mda.distance + parent_distance;
      }

      mda.moveTab();
    });

    $('.sidebar .nav .collapse').on('shown.bs.collapse', function () {
      var $currentActive = mda.sidebarMenuActive;

      mda.distance = $currentActive.parent().position().top - 10;

      if ($currentActive.closest('.collapse').length != 0) {
        var parent_distance = $currentActive.closest('.collapse').parent().position().top;
        mda.distance = mda.distance + parent_distance;
      }

      mda.moveTab();
    });

    $('.sidebar .nav-container .nav > li > a:not([data-toggle="collapse"])').click(function () {
      mda.sidebarMenuActive = $(this);
      var $parent = $(this).parent();

      if (mda.sidebarMenuActive.closest('.collapse').length == 0) {
        mda.isChild = false;
      }

      // we call the animation of the moving tab
      clearTimeout(sidebarTimer);

      var $currentActive = mda.sidebarMenuActive;

      $('.sidebar .nav-container .nav li').removeClass('visible');

      var $movingTab = mda.movingTab;
      $movingTab.addClass('moving');

      $movingTab.css('padding-left', $currentActive.css('padding-left'));
      var button_text = $currentActive.html();

      var $currentActive = mda.sidebarMenuActive;
      mda.distance = $currentActive.parent().position().top - 10;

      if ($currentActive.closest('.collapse').length != 0) {
        var parent_distance = $currentActive.closest('.collapse').parent().position().top;
        mda.distance = mda.distance + parent_distance;
      }

      mda.moveTab();

      sidebarTimer = setTimeout(function () {
        $movingTab.removeClass('moving');
        $currentActive.parent().addClass('visible');
      }, 650);

      setTimeout(function () {
        $movingTab.html(button_text);
      }, 10);
    });
  },
  setParentCollapse: function () {
    if (mda.isChild == true) {
      var $sidebarParent = mda.sidebarMenuActive.parent().parent().parent();
      var collapseId = $sidebarParent.siblings('a').attr("href");

      $(collapseId).collapse("show");

      $(collapseId).collapse()
        .on('shown.bs.collapse', () => {
          mda.setMovingTabPosition();
        })
        .on('hidden.bs.collapse', () => {
          mda.setMovingTabPosition();
        });
    }
  },
  animateMovingTab: function () {
    clearTimeout(sidebarTimer);

    var $currentActive = mda.sidebarMenuActive;

    $('.sidebar .nav-container .nav li').removeClass('visible');

    var $movingTab = mda.movingTab;
    $movingTab.addClass('moving');

    $movingTab.css('padding-left', $currentActive.css('padding-left'));
    var button_text = $currentActive.html();

    mda.setMovingTabPosition($currentActive);

    sidebarTimer = setTimeout(function () {
      $movingTab.removeClass('moving');
      $currentActive.parent().addClass('visible');
      // const elemSidebar = <HTMLElement>document.querySelector('.sidebar-wrapper');
      // let ps = new PerfectScrollbar(elemSidebar);
      // ps.update();
    }, 650);

    setTimeout(function () {
      $movingTab.html(button_text);
    }, 10);
  },
  moveTab: function () {
    mda.movingTab.css({
      'transform': 'translate3d(0px,' + mda.distance + 'px, 0)',
      '-webkit-transform': 'translate3d(0px,' + mda.distance + 'px, 0)',
      '-moz-transform': 'translate3d(0px,' + mda.distance + 'px, 0)',
      '-ms-transform': 'translate3d(0px,' + mda.distance + 'px, 0)',
      '-o-transform': 'translate3d(0px,' + mda.distance + 'px, 0)'
    });
  }
};
