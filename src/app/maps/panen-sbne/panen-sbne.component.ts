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
    selector: 'panen-sbne-cmp',
    templateUrl: 'panen-sbne.component.html'
})

export class PanenSbneComponent implements OnInit, AfterViewInit{


  urlSafe: any;
    constructor(
      public sanitizer:DomSanitizer
  ) {
      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(SERVER_API_URL+ "/mapPanenSbne/show");
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
