import { Component, OnInit, AfterViewInit } from '@angular/core';

declare var $: any;
import 'raphael/raphael.min.js'
import 'jquery-mousewheel/jquery.mousewheel.js'
import 'jquery-mapael';
import 'jquery-mapael/js/maps/world_countries.js';
import { DomSanitizer } from '@angular/platform-browser';
import {SERVER_API_URL}from 'src/app/app.constants';
declare interface Task {
  title: string;
  checked: boolean;
}
@Component({
    moduleId: module.id,
    selector: 'sph-sbme-cmp',
    templateUrl: 'sph-sbme.component.html'
})

export class SphSbmeComponent implements OnInit, AfterViewInit{

    public tasks1: Task[];
    public tasks2: Task[];
    public tasks3: Task[];
  urlSafe: any;
    constructor(
      public sanitizer:DomSanitizer
  ) {
      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(SERVER_API_URL+ "/mapSphSbme/show");
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
