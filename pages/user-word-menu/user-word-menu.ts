import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular';


import { WordsListPage } from '../words-list/words-list';
import { WordPage } from '../word/word';

/**
 * Generated class for the UserWordMenuPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-word-menu',
  templateUrl: 'user-word-menu.html',
})
export class UserWordMenuPage {

  constructor(
				public modalCtrl: ModalController, 
				public navCtrl: NavController, 
				public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserWordMenuPage');
  }

  
  gotoPage(page){
		switch(page){
			case 'current':
				this.navCtrl.push(WordsListPage, { listType: 1});
				break;
			case 'inactive':
				this.navCtrl.push(WordsListPage, { listType: 2});
				break;
			case 'test':
				this.navCtrl.push(WordPage, { showType: 2 ,play: 0 ,wordTitle: "Take a Test"});
				break;
			case 'play':
				this.navCtrl.push(WordPage, { showType: 2, play: 1,wordTitle: "Play Word"});
				break;
		}

	  
  }
}
