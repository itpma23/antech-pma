import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProfileComponent } from './profile.component';
import { ProfileRoutes } from './profile.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ProfileRoutes),
        FormsModule,
    ],
    declarations: [ProfileComponent]
})

export class ProfileModule {}
