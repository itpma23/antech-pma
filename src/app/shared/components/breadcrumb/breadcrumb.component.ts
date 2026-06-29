import { Component, OnInit } from "@angular/core";
import {
	Router,
	ActivatedRoute,
	NavigationEnd,
	Params,
	PRIMARY_OUTLET
} from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

import "rxjs/add/operator/filter";

import { AuthenticationService } from '../../services/authentication.service';

interface IBreadcrumb {
	label: string;
	params: Params;
	url: string;
	hasParams: boolean;
	isHome: boolean;
}

@Component({
	selector: 'app-breadcrumb',
	templateUrl: './breadcrumb.component.html',
	styleUrls: ['./breadcrumb.component.scss']
})

export class BreadcrumbComponent implements OnInit {
	public breadcrumbs: IBreadcrumb[];
	show = false;
	icon: string;
	label: string;
	appTitle = 'VipsPM';
	parentTitle: string;
	loginUser: any;

	/**
	 *	@class BreadcrumbComponent
	 *	@constructor
	*/
	constructor(
		public translate: TranslateService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private titleService: Title,
		private authenticationService: AuthenticationService
	) {
		this.breadcrumbs = [];
		this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
		if (this.loginUser.settings.company_short_name) {
			this.appTitle = this.loginUser.settings.company_short_name;
		}
	}

	/**
	 *	Invoked only once when the component/directive is instantiated.
	 *
	 *	@class BreadcrumbComponent
	 *	@method ngOnInit
	*/
	ngOnInit() {
		this.breadcrumbs = this.getBreadcrumbs(this.activatedRoute.root);
		this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
			let root: ActivatedRoute = this.activatedRoute.root;
			this.breadcrumbs = this.getBreadcrumbs(root);
		});
	}

	/**
	 *	Returns array of IBreadcrumb objects that represent the breadcrumb
	 *
	 *	@class BreadcrumbComponent
	 *	@method getBreadcrumbs
	 *	@param {ActivateRoute} route
	 *	@param {string} url
	 *	@param {IBreadcrumb[]} breadcrumbs
	*/
	private getBreadcrumbs(route: ActivatedRoute, url: string="", breadcrumbs: IBreadcrumb[]=[]): IBreadcrumb[] {
		const ROUTE_DATA_BREADCRUMB: string = "text";
		const ROUTE_DATA_ICON: string = "icon";

		// --
		// get the child routes
		let children: ActivatedRoute[] = route.children;

		// --
		// Return if there are no more children
		if (children.length === 0) {
			return breadcrumbs;
		}

		// --
		// Iterate over each children
		for (let child of children) {
			// --
			// Verify primary route
			if (child.outlet !== PRIMARY_OUTLET) {
				continue;
			}

			// --
			// Set page title
			if(!child.snapshot.data.title) {
				this.titleService.setTitle(`${this.appTitle}`);
			} else {
				this.translate.get(`${child.snapshot.data.title}`) .subscribe(value => {
					this.titleService.setTitle(`${value} | ${this.appTitle}`);
					this.parentTitle = value;
				});
			}

			// --
			// Check for breadcrums
			if(!child.snapshot.data.breadcrumbs) {
				continue;
			}

			// --
			// Verify the custom data property "breadcrumb" is specified on the route
			if (!child.snapshot.data.breadcrumbs.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
				return this.getBreadcrumbs(child, url, breadcrumbs);
			}

			this.show = child.snapshot.data.breadcrumbs.hasOwnProperty('show');
			// this.icon = child.snapshot.data.breadcrumbs[ROUTE_DATA_ICON];
			// this.label = child.snapshot.data.breadcrumbs[ROUTE_DATA_BREADCRUMB];

			// --
			// Get the route's URL segment
			let routeURL: string = child.snapshot.url.map(segment => segment.path).join("/");

			if (child.snapshot.url.map(segment => segment.path).length === 0) {
				return this.getBreadcrumbs(child, url, breadcrumbs);
			}

			// --
			// Append route URL to URL
			url += `/${routeURL}`;

			// --
			// Add breadcrumb
			this.translate.get(`${child.snapshot.data.breadcrumbs[ROUTE_DATA_BREADCRUMB]}`) .subscribe(value => {
				this.label = value;
			});

			let breadcrumb: IBreadcrumb = {
				label: this.label,
				params: child.snapshot.params,
				url: url,
				hasParams: child.snapshot.data.breadcrumbs.hasOwnProperty('hasParams'),
				isHome: child.snapshot.data.breadcrumbs.hasOwnProperty('isHome'),
			};
			breadcrumbs.push(breadcrumb);

			// --
			// Recursive
			return this.getBreadcrumbs(child, url, breadcrumbs);
		}
	}

}

