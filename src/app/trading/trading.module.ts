import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatRadioModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { ModalModule, BsDropdownModule, BsDatepickerModule, DatepickerModule, TimepickerModule } from 'ngx-bootstrap';
import { ExportAsModule } from 'ngx-export-as';
import { QuillModule } from 'ngx-quill';
import { LSelect2Module } from 'ngx-select2';
import { HttpLoaderFactory } from '../shared/shared.module';
import { TradingRoutes } from './trading.routing';
import { TradingPpStatusApprovalComponent } from './pp-status-approval/pp_status_approval.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(TradingRoutes),
    FormsModule,ReactiveFormsModule,
    
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DatepickerModule,
    TimepickerModule.forRoot(),
    ExportAsModule,
    DataTablesModule,
    LSelect2Module,
    QuillModule.forRoot(),
    MatInputModule,MatRadioModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [
TradingPpStatusApprovalComponent

  ],entryComponents:[
TradingPpStatusApprovalComponent
   ]
})
export class TradingModule { }
