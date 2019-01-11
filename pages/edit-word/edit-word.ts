import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { DialogProvider } from '../../providers/dialog/dialog';
import { SessionProvider } from '../../providers/session/session';
import { SettingProvider } from '../../providers/setting/setting';

/**
 * Generated class for the EditWordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-word',
  templateUrl: 'edit-word.html',
})
export class EditWordPage {
	errorCode: any;
	errorMessage: any;   
	public wordTitle : any;
	public wid : any;
	public wordItem : any;
	public adminMobile: any = '' ;
	formdata = {
				eng_translate: '',
				per_translate: '',
				verb: '',
				noun: '',
				adjective: ''
			  };

  constructor(
				public navCtrl: NavController, 
				public navParams: NavParams,
				public setting:SettingProvider,
				public events:Events,
				public session:SessionProvider,
				public http:Http,
				public dialog:DialogProvider,
			) {
				this.wordTitle = navParams.get("wordTitle");
				this.wid = navParams.get("wid");	  				
			}

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditWordPage');
  }
  
	ngOnInit(){
		this.loadWord();
	}

    loadWord(){
		this.session.getUserToken().then((token) => {
			if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
				this.adminMobile = 	token['mobile'];
				var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=learnEng&Op=loadWord&wid='+this.wid+'&token='+token['token']; 
				console.log(url);
				this.dialog.createDefaultLoading();		
				 this.http.get(url)
					 .map(res => res.json())
					 .subscribe(data => {
						 this.errorCode = data.code;
						 this.errorMessage = data.message;
						 if(this.errorCode != 1){
							this.dialog.showError(this.errorMessage);
							}
						else{
							this.wordItem = data.word;
							this.formdata.eng_translate = data.word.eng_translate;
							this.formdata.per_translate = data.word.per_translate;
							this.formdata.verb = data.word.verb;
							this.formdata.noun = data.word.noun;
							this.formdata.adjective = data.word.adjective;
						}
									
						this.dialog.closeDelayLoading(500);		
						 },error=>{
							console.log(error);// Error getting the data
							this.dialog.closeLoading();		
							this.dialog.showError('Error in receive data');
						});
			}
		});							
	}  
  
  
  editWord(){
			this.dialog.createDefaultLoading(); 
			this.session.getUserToken().then((token) => {
				if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
						var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=learnEng&Op=submitWord&wid='+this.wordItem.wid+'&token='+token['token']; 
						let postData=JSON.stringify({	eng_translate:this.formdata.eng_translate ,
														per_translate:this.formdata.per_translate,
														verb:this.formdata.verb,
														noun:this.formdata.noun,
														adjective:this.formdata.adjective});
						this.http.post(url ,postData )
						 .map(res => res.json())
						 .subscribe(data => {
								this.errorCode = data.code;
								this.errorMessage = data.message;
								if(this.errorCode != 1  ){
									this.dialog.raiseError(this.errorMessage,this.errorCode,2001);
								}else{
									this.dialog.showMessage('word update successfuly');
								}
								this.dialog.closeLoading();		
							 },error=>{ 
								console.log(error);// Error getting the data
								this.dialog.showError('خطا در دريافت اطلاعات');
								this.dialog.closeLoading();		
							});					
				}else{
					this.events.publish( 'user:mustLogin' );		
				}
			});	
  }
  
}
