import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertDialogProvider } from '../../providers/alert-dialog/alert-dialog';
import { LoadingDialogProvider } from '../../providers/loading-dialog/loading-dialog';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';

import { SessionProvider } from '../../providers/session/session';
import { SettingProvider } from '../../providers/setting/setting';
import { DialogProvider } from '../../providers/dialog/dialog';

/**
 * Generated class for the CreateAccountPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-account',
  templateUrl: 'create-account.html',
})
export class CreateAccountPage {
	public email : any ;
	public pass : any ;
	public name : any ;
	public mobile : any ;
	public passAgain : any ;
	public country: any  ;
	public countryCode: any  ;
	public countries: any  ;
	public countryCodeNubmer: any  ;
	public sex: any  ;
	errorCode: any;
	errorMessage: any;   
	public countryCodeArray: any = [];

  constructor(
				public events:Events,
				public navCtrl: NavController, 
				public navParams: NavParams,			
				public alertDialog : AlertDialogProvider,
				public http:Http,
				public setting:SettingProvider,
				public dialog:DialogProvider,
				public session:SessionProvider,
				) {
					var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=userRegister&Op=getCountryCode'; 
					    console.log(url);

					 this.http.get(url)
						 .map(res => res.json())
						 .subscribe(data => {
							 this.errorCode = data.code;
							 this.errorMessage = data.message;
								if(this.errorCode != 1){
									this.dialog.raiseError(this.errorMessage,this.errorCode ,1300);
								}else{
									this.countries = data.countryCodes;
									for(let i=0;i<this.countries.length;i++){
										this.countryCodeArray[this.countries[i].country_code] = this.countries[i].dialling_code;
									}
					    console.log(data);
								}
								this.dialog.closeDelayLoading(500);		
							 },error=>{
								this.dialog.closeLoading();		
								console.log(error);// Error getting the data
								this.dialog.showError('Error in receive data');
							});					
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateAccountPage');
  }
  createAccount() {
		if( this.email<= '' || 
			this.email == null || 
			this.email.length <= 6 || 
			this.email.includes("@") == false  ||
			this.email.includes(".") == false  ||
			this.email.lastIndexOf('@') > this.email.lastIndexOf('.') ||
			this.email.lastIndexOf('@') != this.email.indexOf('@')){
			this.alertDialog.showError('Error in email, Enter correct email');
			return;
		}
		if( this.name<= '' || this.name == null ||this.name.length <= 5  ){
			this.alertDialog.showError('Please insert correct name');
			return;
		}
		if( this.mobile<= '' || this.mobile == null ||this.mobile.length < 9  ){
			this.alertDialog.showError('Please insert correct mobile');
			return;
		}
		if( this.country<= '' || this.country == null   ){
			this.alertDialog.showError('Please chose country');
			return;
		}
		if( this.sex<= '' || this.sex == null   ){
			this.alertDialog.showError('Please chose sex');
			return;
		}
		if( this.pass<= '' || this.pass == null ||this.pass.length < 5  ){
			this.alertDialog.showError('Password must be at last 5 charachter');
			return;
		}
		if( this.passAgain<= '' || this.passAgain == null ||this.pass != this.passAgain  ){
			this.alertDialog.showError('The repeated password must be same as password');
			return;
		}
		
		this.session.createUserByEmail(this.email ,this.pass ,this.name ,this.mobile ,this.country ,this.sex);  
  }
  
  countrySelected($event){
		if( this.country<= '' || this.country == null   ){
			return;
		}
		this.countryCodeNubmer = this.countryCodeArray[this.country];
  }
}
