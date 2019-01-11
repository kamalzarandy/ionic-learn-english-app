import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Http } from '@angular/http';
import { DialogProvider } from '../../providers/dialog/dialog';
import { SettingProvider } from '../../providers/setting/setting';
import { SessionProvider } from '../../providers/session/session';

import { WordPage } from '../word/word';

/**
 * Generated class for the WordsListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-words-list',
  templateUrl: 'words-list.html',
})
export class WordsListPage {
	public listType : any;
	public index : any;
	public lastIndex: any;   
	public wordsList: any;   
	public listTitle: any;   
	errorCode: any;
	errorMessage: any;   
	public wordIndex: any;   
	public searchValue: any;   

  constructor(
				public session:SessionProvider,
				public setting:SettingProvider,
				public dialog:DialogProvider,
				public http:Http,

			public navCtrl: NavController, 
			public navParams: NavParams
			) {
	  	this.listType = navParams.get("listType");
		if(this.listType == 1 )
			this.listTitle = 'Active Learning Words List';
		else
			this.listTitle = 'Inactive Learning Words List';
		this.wordIndex = 0;
				
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WordsListPage');
  }
  	ngOnInit(){
		this.loadWordsList(0);
		console.log('ionViewDidLoad ConsultationProfilePage');
		//this.dialog.closeDelayLoading(1500);				
	}
    loadWordsList( index ,infiniteScroll = null ,searchValue = null){
		  if( index == 0  )
			  this.lastIndex = false;
		  else if( this.lastIndex == true ){
			  infiniteScroll.complete();
			  return;
		  }
			this.session.getUserToken().then((token) => {
				if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 	  
					if( index == 0)
						this.dialog.createDefaultLoading();
								console.log(url);// Error getting the data
					var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=learnEng&Op=UserWordList&index='+index+'&listType='+this.listType+'&token='+token['token']; 
					console.log(url);
					if( searchValue != null )
						var url = url +'&search='+searchValue; 
					 this.http.get(url)
						 .map(res => res.json())
						 .subscribe(data => {
							 this.errorCode = data.code;
							 this.errorMessage = data.message;
								if(this.errorCode != 1){
									this.dialog.raiseError(this.errorMessage,this.errorCode ,1300);
								}else{
										if( index == 0)
											this.wordsList = data.list;
										else{
											if(data.list.length == 0) 
												this.lastIndex = true;
											var arr2 = this.wordsList.concat( data.list );
											this.wordsList = arr2;
											infiniteScroll.complete(); 
										}
								}
								if( index == 0)
									this.dialog.closeDelayLoading(500);		
							 //alert(this.categoryList);
							 },error=>{
								if( index == 0)
									this.dialog.closeLoading();		
								console.log(error);// Error getting the data
								this.dialog.showError('Error in receive data');
							});
				}
			});
	}
  	goToWordView(item: any) {
	    this.navCtrl.push(WordPage, { wordTitle: item.word ,wid: item.wid ,showType: 1});
	}
	
	doloadWordsListInfinite(infiniteScroll) {
		this.wordIndex++;
		this.loadWordsList(this.wordIndex ,infiniteScroll,this.searchValue );
	}	
	playSound(item){
		if(item.soundUrl > ''){
			let audioAsset = new Audio(item.soundUrl);
			audioAsset.play();
		}
	}		
}
