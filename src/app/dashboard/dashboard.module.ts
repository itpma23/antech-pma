import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdTableComponent } from '../md/md-table/md-table.component';

import { DataTablesModule } from 'angular-datatables';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LSelect2Module } from 'ngx-select2';
import { NgxGaugeModule } from 'ngx-gauge';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
        FormsModule,
        DataTablesModule,
        NgxChartsModule,
        LSelect2Module,
        NgxGaugeModule

    ],
    declarations: [DashboardComponent, MdTableComponent]
})

export class DashboardModule {}
