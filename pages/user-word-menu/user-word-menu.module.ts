import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserWordMenuPage } from './user-word-menu';

@NgModule({
  declarations: [
    UserWordMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(UserWordMenuPage),
  ],
})
export class UserWordMenuPageModule {}
