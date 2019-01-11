import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';


import { SessionProvider } from '../../providers/session/session';
import { DialogProvider } from '../../providers/dialog/dialog';

import { ChangePasswordPage } from '../change-password/change-password';

/**
 * Generated class for the ForgetPasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forget-password',
  templateUrl: 'forget-password.html',
})
export class ForgetPasswordPage {
	public email : any ;

  constructor(
			public navCtrl: NavController, public navParams: NavParams,		
			public session : SessionProvider,
			public dialog:DialogProvider,
			public viewCtrl: ViewController
) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgetPasswordPage');
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
				if(data == true){
					this.viewCtrl.dismiss();
					this.navCtrl.push(ChangePasswordPage, {email:this.email});
					console.log('push new control:'+data);
				}	  
			});
				/* 
			*/
  }
}
