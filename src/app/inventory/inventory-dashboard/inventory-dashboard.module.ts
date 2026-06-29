import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { InventoryDashboardRoutes } from './inventory-dashboard.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ModalModule, BsDropdownModule, BsDatepickerModule, DatepickerModule, TimepickerModule } from 'ngx-bootstrap';
import { ExportAsModule } from 'ngx-export-as';
import { QuillModule } from 'ngx-quill';
import { LSelect2Module } from 'ngx-select2';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatRippleModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(InventoryDashboardRoutes),
    FormsModule, ReactiveFormsModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DatepickerModule,
    TimepickerModule.forRoot(),
    ExportAsModule,
    DataTablesModule,
    LSelect2Module,
    QuillModule.forRoot(), 
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
  ]
})
export class InventoryDashboardModule { }
