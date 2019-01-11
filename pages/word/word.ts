import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { DialogProvider } from '../../providers/dialog/dialog';
import { SessionProvider } from '../../providers/session/session';
import { SettingProvider } from '../../providers/setting/setting';
//import {NativeAudio} from 'ionic-native';
import { NativeAudio } from '@ionic-native/native-audio';
import {  ViewController } from 'ionic-angular';

import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { Platform } from 'ionic-angular';

import { EditWordPage } from '../edit-word/edit-word';

declare var cordova: any;


/**
 * Generated class for the WordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-word',
  templateUrl: 'word.html',
})
export class WordPage {
	public loadType : any;
	public wordTitle : any;
	public wordItem : any;
	public showType : any;
	public wid : any;
	public eng_translate : any;
	public per_translate : any;
	public verb : any;
	public noun : any;
	public adjective : any;
	public play : any;
	public isPlay : any;
	public playInterval : any;
	public playTitle = 'Play';
	errorCode: any;
	errorMessage: any;   
	public appDataPath ;
	public fileTransfer: TransferObject ;
	public adminMobile: any = '' ;
	public doNotshowMeaning: any = 0 ;
	public userData: any  ;

    audioType: string = 'html5';
    osType: string = '';
    sounds: any = [];

  constructor(
				public file: File, 
				public filePath: FilePath, 
				public transfer: Transfer, 
				public	platform: Platform, 
				public setting:SettingProvider,
				public events:Events,
				public session:SessionProvider,
				public http:Http,
				public dialog:DialogProvider,
				public navCtrl: NavController, 
				public modalCtrl: ModalController, 
				public popoverCtrl: PopoverController, 
				public navParams: NavParams, 
				public NAudio: NativeAudio  ,
				public viewCtrl: ViewController,
				) {

				this.wordTitle = navParams.get("wordTitle");
				this.wid = navParams.get("wid");	  
				this.showType = navParams.get("showType");
				this.play = navParams.get("play");
				this.isPlay = false;
		
		this.platform.ready().then(() => {
            if (this.platform.is('android')) {
				this.appDataPath = cordova.file.externalRootDirectory+'/learnEnglish/';		
				this.osType = 'android';
            }
            if (this.platform.is('ios')) {
				this.appDataPath = cordova.file.externalRootDirectory+'/learnEnglish/';		
				this.osType = 'ios';
            }
			if (this.platform.is('mobileweb')) {
				this.appDataPath = cordova.file.externalRootDirectory;		
				this.osType = 'mobileweb';
            }				
		});	
		
  }

  ionViewWillEnter(){
		if(this.wid > '' && this.showType == 1)
			this.loadWord(this.showType);
		else if (this.showType == 2)
			this.loadWord(this.showType);	  
  }
  ionViewWillLeave(){
		clearInterval(this.playInterval);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad WordPage');
  }
  	ngOnInit(){
		console.log('ionViewDidLoad ConsultationProfilePage');
		//this.dialog.closeDelayLoading(1500);				
	}
	disableMeaning(){
		this.doNotshowMeaning = 1;
		this.eng_translate = '';
		this.per_translate = '';
		this.verb = '';
		this.noun = '';
		this.adjective = '';
		
	}
	
	nextWord(item ,type){
			this.disableMeaning();
			this.session.getUserToken().then((token) => {
			if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 	  
				var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=learnEng&Op=remStatus&type=read&remType='+type+'&wid='+item.wid+'&token='+token['token'];
				console.log(url);
				this.remStatus(url);
			}
		});		
	}
	
	playWord(){
		this.disableMeaning();
		if (this.isPlay == 1){
			this.isPlay  = 0;
			this.playTitle = "Play";
			clearInterval(this.playInterval);
		}else{
			this.isPlay = 1;
			this.playTitle = "Pause";
			this.playInterval = 
				 setInterval( () => {
					this.loadWord(3);
			 }, 8000);			
		}
	}
	
	remStatus(url){
		console.log(url);
		 this.http.get(url)
			 .map(res => res.json())
			 .subscribe(data => {
				this.loadWord(this.loadType);
				 this.errorCode = data.code;
				 this.errorMessage = data.message;
				 },error=>{
					console.log(error);// Error getting the data
					this.dialog.showError('خطا در دريافت اطلاعات');
				});	
	}
	
	closDialog(){
		clearInterval(this.playInterval);
		this.viewCtrl.dismiss(false);
	}
	
	showMeaning(item){
		this.eng_translate = item.eng_translate;
		this.per_translate = item.per_translate;
		this.verb = item.verb;
		this.noun = item.noun;
		this.adjective = item.adjective;
	}
	
    loadWord(loadType){
		this.session.getUserToken().then((token) => {
			if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
				this.adminMobile = 	token['mobile'];
				if(loadType == 1){
					this.loadType = 1;
					var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=learnEng&Op=loadWord&wid='+this.wid+'&token='+token['token']; 
				}
				else if(loadType == 2){
					this.loadType = 2;
					var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=learnEng&Op=readWords&token='+token['token'];
					this.disableMeaning();
				}
				else if(loadType == 3){
					var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=learnEng&Op=playWords&token='+token['token'];						
					this.disableMeaning();
				}
				console.log(url);
				this.dialog.createDefaultLoading();		
				 this.http.get(url)
					 .map(res => res.json())
					 .subscribe(data => {
						 this.errorCode = data.code;
						 this.errorMessage = data.message;
						 if(this.errorCode != 1){
							this.dialog.showError(this.errorMessage);
							this.closDialog();
							}
						else{
							if(data.word.length == 0 || data.word.length == 'undefined' || data.word.length <= '') 
								this.closDialog();
							this.wordItem = data.word;
							this.userData = data.userData;
							if( this.doNotshowMeaning != 1){
								this.eng_translate = data.word.eng_translate;
								this.per_translate = data.word.per_translate;
								this.verb = data.word.verb;
								this.noun = data.word.noun;
								this.adjective = data.word.adjective;
							}

							if(this.platform.is('cordova'))
								this.download( data.word.soundUrl ,data.word.soundName);
							if( this.isPlay  == 1 )
								this.playSound(this.wordItem);

							//this.smallImage = ;
						}
									
						this.dialog.closeDelayLoading(500);		
						 },error=>{
							console.log(error);// Error getting the data
							this.dialog.closeLoading();		
							this.dialog.showError('Error in receive data');
						});
			}else{
					this.events.publish( 'user:mustLogin' );		
				}
		});							
	}  
	

	playSound(item){
		if(item.soundUrl > '' ){
			if(this.platform.is('cordova')){
				var SoundPath = this.appDataPath+item.soundName;
				this.NAudio.preloadSimple(item.word, SoundPath).then();
				this.NAudio.play(item.word, () => console.log('uniqueId1 is done playing'));
				let audioAsset = new Audio(item.soundUrl);
				//this.dialog.showError(audioAsset);
				audioAsset.play();

			}else{ 
				let audioAsset = new Audio(item.soundUrl);
				//this.dialog.showError(audioAsset);
				audioAsset.play();
			}
		}
		
		//var SoundPath = this.appDataPath+item.soundName;
		//this.NAudio.preloadSimple(item.word, item.sound).then();
		//this.NAudio.play(item.word, () => console.log('uniqueId1 is done playing'));
 
		 // this.NAudio.preloadSimple(item.word, item.sound);
		 // this.NAudio.loop(item.word);	
	}
  	download(url ,filename) {	
								//this.dialog.showMessage('going to downlaod='+this.appDataPath + filename );
		this.file.checkFile(this.appDataPath, filename).then(result => {
					  }, (error) => {
						this.fileTransfer.download(url, this.appDataPath + filename ).then((entry) => {
								//this.dialog.showMessage('download complete');
								console.log('download complete: ' + entry.toURL());
							  }, (error) => {
								//this.dialog.showMessage('download error');
						  });			
				  });			
	}
	
	addToList(item){
		console.log(item)
		this.session.getUserToken().then((token) => {
			if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
					var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=learnEng&Op=addToVocabList&wid='+item.wid+'&token='+token['token']; 
					console.log(url);
					this.http.get(url)
					 .map(res => res.json())
					 .subscribe(data => {
							this.errorCode = data.code;
							this.errorMessage = data.message;
							if(this.errorCode != 1){
								this.dialog.raiseError(this.errorMessage,this.errorCode ,1401);
							}else{
								this.dialog.showMessage('Word is add to your learning list');
								this.loadWord(this.showType);
							}
						 },error=>{ 
							console.log(error);// Error getting the data
							this.dialog.showError('Error in receive data');
						});					
			}else{
				this.events.publish( 'user:mustLogin' );		
			}
		});
	}
	
	editWord(item){
	    this.navCtrl.push(EditWordPage, {  wordTitle: item.word ,wid: item.wid });		
	}
}
