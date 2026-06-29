import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { ToggleFullscreenDirective } from '../../shared/directives/toggle-fullscreen.directive';
@NgModule({
    imports: [ RouterModule, CommonModule ],
    declarations: [ NavbarComponent , ToggleFullscreenDirective],
    exports: [ NavbarComponent,   ToggleFullscreenDirective ]
})

export class NavbarModule {}
