import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SessionProvider } from '../../providers/session/session';
import { DialogProvider } from '../../providers/dialog/dialog';

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
	public email : any ;
	public pass : any ;
	public passAgain : any ;
	public code : any ;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  			public session : SessionProvider,
			public dialog:DialogProvider,
) {
	  	    this.email = navParams.get("email");	
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }
  
	sendCode(){
		if( this.email<= '' || 
			this.email == null || 
			this.email.length <= 6 || 
			this.email.includes("@") == false  ||
			this.email.includes(".") == false  ||
			this.email.lastIndexOf('@') > this.email.lastIndexOf('.') ||
			this.email.lastIndexOf('@') != this.email.indexOf('@')){
			this.dialog.showError('Error in email, Enter correct email');
			return;
		}
	  
			this.session.sendValidationCodeEmail(this.email).then((data) => {
				console.log(data);
			});
				/* 
			*/
	}
	
	changeThePassword(){
		if( this.pass<= '' || this.pass == null ||this.pass.length < 5  ){
			this.dialog.showError('Password must be at last 5 charachter');
			return;
		}
		if( this.passAgain<= '' || this.passAgain == null ||this.pass != this.passAgain  ){
			this.dialog.showError('The repeated password must be same as password');
			return;
		}
		
		if( this.code <= ''  ){
			this.dialog.showError('The code must enter');
			return;
		}
 		this.session.changePassword(this.email ,this.code ,this.pass);  

	}
}
