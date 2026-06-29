import { Component, OnInit, AfterViewInit } from '@angular/core';

declare var $: any;
import 'raphael/raphael.min.js'
import 'jquery-mousewheel/jquery.mousewheel.js'
import 'jquery-mapael';
import 'jquery-mapael/js/maps/world_countries.js';
import { DomSanitizer } from '@angular/platform-browser';
import {SERVER_API_URL}from 'src/app/app.constants';

@Component({
    moduleId: module.id,
    selector: 'pemupukan-sbme-cmp',
    templateUrl: 'pemupukan-sbme.component.html'
})

export class PemupukanSbmeComponent implements OnInit, AfterViewInit{


  urlSafe: any;
    constructor(
      public sanitizer:DomSanitizer
  ) {
      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(SERVER_API_URL+ "/mapPemupukanSbme/show");
  }
    ngOnInit(){
      // $(".container").mapael({
      //   map: {
      //     name: "world_countries"
      //   }
      // });

    }

    ngAfterViewInit(){
        //  Activate the tooltips
        $('[rel="tooltip"]').tooltip();
    }



}
