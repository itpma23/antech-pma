import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecimalDotPipe } from './decimal-dot.pipe';
import { FloorPipe } from './floor.pipe';




@NgModule({
  declarations: [
    DecimalDotPipe,
    FloorPipe
  ],
  exports: [
    DecimalDotPipe,
    FloorPipe
  ]
})
export class PipesModule { }
