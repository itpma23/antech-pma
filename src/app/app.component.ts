import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import * as $ from "jquery";
import { AuthenticationService } from './shared/services/authentication.service';
@Component({
    selector: 'my-app',
    templateUrl: './app.component.html'
})

export class AppComponent implements OnInit{
    constructor(private elRef:ElementRef,
      public translate: TranslateService,
		public authenticationService: AuthenticationService) {
    //   this.authenticationService.loginUser.subscribe(x => this.loginUser = x);

		// if(this.loginUser) {
		// 	// translate.setDefaultLang(this.loginUser.language);
		// 	translate.use(this.loginUser.language);
		// }else{
		 	translate.setDefaultLang('id');
		// 	// translate.use('en');
		// }

		// if (localStorage.getItem("permissions") != 'undefined' && localStorage.getItem("permissions") != null) {
		// 	authenticationService.setUserPermissions(JSON.parse(localStorage.getItem("permissions")));
		// }
    }
    ngOnInit(){
        let body = document.getElementsByTagName('body')[0];
        var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
        if (isWindows){
           // if we are on windows OS we activate the perfectScrollbar function
            body.classList.add("perfect-scrollbar-on");
        } else {
            body.classList.add("perfect-scrollbar-off");
        }
       // $.material.init();
    }
}
