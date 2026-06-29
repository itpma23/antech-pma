import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxEditorModule } from 'ngx-editor';
import { DatepickerModule, BsDatepickerModule, TooltipModule } from 'ngx-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ShortNamePipe } from './pipes/short-name.pipe';
import { StringToArrayFilterPipe } from './pipes/string-to-array-filter.pipe';
import { DecimalToColonPipe } from './pipes/decimal-to-colon.pipe';
import { AsDatePipe } from './pipes/as-date.pipe';
import { CreateShortNamePipe } from './pipes/create-short-name.pipe';
import { RoundNumberPipe } from './pipes/round-number.pipe'
import { KeysPipe } from './pipes/keys.pipe';
import { FilterUniquePipe } from './pipes/filter-unique.pipe';
import { UndersocreToSpacePipe } from './pipes/undersocre-to-space.pipe';
import { ObjToArPipe } from './pipes/obj-to-ar.pipe';
import { DateTimeFormatFilterPipe } from './pipes/date-time-format-filter.pipe';
import { UcfirstPipe } from './pipes/ucfirst.pipe';
import { StrToFirstLetterPipe } from './pipes/str-to-first-letter.pipe';
import { FormatJamPipe } from './pipes/format-jam';

@NgModule({
	providers: [ DatePipe, UndersocreToSpacePipe, DateTimeFormatFilterPipe ],
	declarations: [

		ShortNamePipe,
		StringToArrayFilterPipe,
		DecimalToColonPipe,
		AsDatePipe,
		CreateShortNamePipe,
		RoundNumberPipe,
		KeysPipe,
		ObjToArPipe,
		FilterUniquePipe,
		UndersocreToSpacePipe,
		DateTimeFormatFilterPipe,
		UcfirstPipe,
		StrToFirstLetterPipe,
    FormatJamPipe
	],
	imports: [
		// FormsModule,
		// ReactiveFormsModule,
		// CommonModule,
		// NgxEditorModule,
		// NgxPermissionsModule,
		// DatepickerModule.forRoot(),
		// BsDatepickerModule.forRoot(),
		// TooltipModule.forRoot(),
		TranslateModule.forChild({
			loader: {
				provide: TranslateLoader,
				useFactory: (HttpLoaderFactory),
				deps: [HttpClient]
			}
		})
	],
	exports: [

		ShortNamePipe,
		StringToArrayFilterPipe,
		DecimalToColonPipe,
		AsDatePipe,
		CreateShortNamePipe,
		RoundNumberPipe,
		KeysPipe,
		ObjToArPipe,
		FilterUniquePipe,
		UndersocreToSpacePipe,
		DateTimeFormatFilterPipe,
		StrToFirstLetterPipe,
		UcfirstPipe,FormatJamPipe
	],
	entryComponents: [],

})

export class SharedModule { }

// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}
