import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import {
	ModalModule,
	TooltipModule,
	DatepickerModule,
	BsDatepickerModule,
	TabsModule,
	BsDropdownModule,
  TimepickerModule,
} from 'ngx-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { ExportAsModule } from 'ngx-export-as';
import { UserAuditRoutes } from './user-audit.routing';
import { ListComponent } from './list/list.component';
// import { AddComponent } from './add/add.component';
// import { EditComponent } from './edit/edit.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LSelect2Module } from 'ngx-select2';
import { MatInputModule, MatRadioModule } from '@angular/material';
import { ViewerComponent } from './viewer/viewer.component';
// import { AccessComponent } from './access/acces.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(UserAuditRoutes),
    FormsModule,ReactiveFormsModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DatepickerModule,
    ExportAsModule,
    DataTablesModule,
    LSelect2Module,
    MatInputModule,MatRadioModule,
    TimepickerModule.forRoot(),
    NgxJsonViewerModule,

  ],
  declarations: [
      ListComponent,
      ViewerComponent
      // AddComponent,
      // EditComponent,

  ],entryComponents:[
    ViewerComponent
    // AddComponent,
    // EditComponent
  ]
})

export class UserAuditModule {}
