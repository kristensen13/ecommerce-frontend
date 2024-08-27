import { NgModule } from '@angular/core';

import { ImagePipe } from './image.pipe';

@NgModule({
  exports: [ImagePipe],
  imports: [ImagePipe],
})
export class PipesModule {}
