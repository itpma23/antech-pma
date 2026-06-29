import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	ModalModule,
	TooltipModule,
	DatepickerModule,
	BsDatepickerModule,
	TabsModule,
	BsDropdownModule,

} from 'ngx-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { ExportAsModule } from 'ngx-export-as';



import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ApprovalComponent } from './approval/approval.component';
import { UploadComponent } from './upload/upload.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LSelect2Module } from 'ngx-select2';
import { QuillModule } from 'ngx-quill'
import {MatInputModule}from '@angular/material/input';
import {MatRadioModule}from '@angular/material/radio';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../shared/shared.module';
import { HttpClient } from '@angular/common/http';

import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { MatSelect, MatSelectModule, MatCheckboxModule } from '@angular/material';
import { PrRoutes } from './pr.routing';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PrRoutes),
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
    MatInputModule,MatRadioModule,MatSelectModule,
          MatCheckboxModule,
    TranslateModule.forChild({
			loader: {
				provide: TranslateLoader,
				useFactory: (HttpLoaderFactory),
				deps: [HttpClient]
			}
		}),
  ],
  declarations: [
      ListComponent,
      AddComponent,
      EditComponent,
      ApprovalComponent, UploadComponent


  ],entryComponents:[
    AddComponent,
    EditComponent,  ApprovalComponent, UploadComponent
  ]
})

export class PrModule {}
