import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { MdIconModule, MdCardModule, MdInputModule, MdCheckboxModule, MdButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { FlexLayoutModule } from '@angular/flex-layout';

import { AuthRoutes } from './auth.routing';

import { RegisterComponent } from './register/register.component';
import { PricingComponent } from './pricing/pricing.component';
import { LockComponent } from './lock/lock.component';
import { LoginComponent } from './login/login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatRadioModule,
    MatIconModule,
    MatInputModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    PricingComponent,
    LockComponent
  ]
})

export class AuthModule {}
