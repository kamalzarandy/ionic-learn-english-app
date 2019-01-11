import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ForgetPasswordPage } from '../forget-password/forget-password';
import { CreateAccountPage } from '../create-account/create-account';

import { SessionProvider } from '../../providers/session/session';
import { SettingProvider } from '../../providers/setting/setting';
import { DialogProvider } from '../../providers/dialog/dialog';

/**
 * Generated class for the EmailLoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-email-login',
  templateUrl: 'email-login.html',
})
export class EmailLoginPage {
	public email : any ;
	public pass : any ;

  constructor(public navCtrl: NavController, public navParams: NavParams,
				public setting:SettingProvider,
				public dialog:DialogProvider,
				public session:SessionProvider,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmailLoginPage');
  }

  
  forgetPassword(){
	  	    this.navCtrl.push(ForgetPasswordPage, {});
  }
  
  register(){
	  	    this.navCtrl.push(CreateAccountPage, {});
  }
  login(){
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
		if( this.pass<= '' || this.pass == null ||this.pass.length < 5  ){
			this.dialog.showError('Password must be at last 5 charachter');
			return;
		}
 		this.session.loginByEmail(this.email ,this.pass);  
  }
}
