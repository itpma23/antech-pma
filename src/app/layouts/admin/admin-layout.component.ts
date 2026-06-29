import { Component, OnInit, OnDestroy, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NavItem, NavItemType } from '../../md/md.module';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import PerfectScrollbar from 'perfect-scrollbar';

import * as $ from "jquery";

@Component({
  selector: 'app-layout',
  templateUrl: './admin-layout.component.html'
})

export class AdminLayoutComponent implements OnInit,AfterViewInit {
    public navItems: NavItem[];
    location: Location;
    constructor(location:Location) {
        this.location = location;
    }
    ngAfterViewInit(){
      var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
      if (isWindows){
        // if we are on windows OS we activate the perfectScrollbar function
        //  var $main_panel = $('.main-panel');
        //  console.log($main_panel);
        //  $main_panel.perfectScrollbar();
        const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
        let ps = new PerfectScrollbar(elemMainPanel);
       // ps = new PerfectScrollbar(elemSidebar);
     }

    }
    ngOnInit() {

        var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
        if (isWindows){
           // if we are on windows OS we activate the perfectScrollbar function
            var $main_panel = $('.main-panel');
            // console.log($main_panel);
          //   $main_panel.perfectScrollbar('destroy');
          //  $main_panel.perfectScrollbar();
        }
        this.navItems = [
          { type: NavItemType.NavbarLeft, title: 'Dashboard', iconClass: 'fa fa-dashboard' },

          {
            type: NavItemType.NavbarRight,
            title: '',
            iconClass: 'fa fa-bell-o',
            numNotifications: 5,
            dropdownItems: [
              { title: 'Notification 1' },
              { title: 'Notification 2' },
              // { title: 'Notification 3' },
              // { title: 'Notification 4' },
              { title: 'Another Notification' }
            ]
          },
          {
            type: NavItemType.NavbarRight,
            title: '',
            iconClass: 'fa fa-list',

            dropdownItems: [
              { iconClass: "pe-7s-mail", title: 'Messages' },
              { iconClass: "pe-7s-help1", title: 'Help Center' },
              { iconClass: "pe-7s-tools", title: 'Settings' },
               'separator',
              { iconClass: "pe-7s-lock", title: 'Lock Screen' },
              { iconClass: "pe-7s-close-circle", title: 'Log Out' }
            ]
          },
          { type: NavItemType.NavbarLeft, title: 'Search', iconClass: 'fa fa-search' },

          { type: NavItemType.NavbarLeft, title: 'Account' },
          {
            type: NavItemType.NavbarLeft,
            title: 'Dropdown',
            dropdownItems: [
              { title: 'Action' },
              { title: 'Another action' },
              { title: 'Something' },
              { title: 'Another action' },
              { title: 'Something' },
              'separator',
              { title: 'Separated link' },
            ]
          },
          { type: NavItemType.NavbarLeft, title: 'Log out' }
        ];
    }
    public isMap(){
        // console.log(this.location.prepareExternalUrl(this.location.path()));
        if(this.location.prepareExternalUrl(this.location.path()) == '/maps/fullscreen'){
            return true;
        }
        else {
            return false;
        }
    }
}
