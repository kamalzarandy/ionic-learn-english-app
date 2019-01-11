import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';
import { siteContent } from '../site-content/site-content'; 
import { userProfile } from '../userProfile/userProfile'; 

import { UserWordMenuPage } from '../user-word-menu/user-word-menu';

//import { peopleRelation } from '../peopleRelation/peopleRelation'; 
//2600
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root: any = HomePage;
  tab2Root: any = UserWordMenuPage;
  tab3Root: any = userProfile;
  mySelectedIndex: number;
  constructor(navParams: NavParams) {
    //this.mySelectedIndex = navParams.data.tabIndex || 0;
    this.mySelectedIndex = 2;
	//alert('tabs constructor');
  }
}
