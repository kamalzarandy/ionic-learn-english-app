import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';

declare var cordova: any;

/*
  Generated class for the SettingProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SettingProvider {

	public serverAddress;
	public version;
	public debug;
	public filePath;
	public loginType;//mobile or email
  constructor(
				public http: Http ,			
				platform: Platform, 
				file :File) {
	  /*
	if(device.platform == "iOS")
	{
		var path = cordova.file.tempDirectory;
	}
	else if(device.platform == "Android")
	{
		var path = cordova.file.externalRootDirectory;
	}
	  */
//	  	this.filePath = cordova.file.dataDirectory;
	//this.filePath = cordova.file.dataDirectory;

	//this.filePath = cordova.file.externalRootDirectory;
	platform.ready().then(() => {
			var name = null;
			name = cordova.file.externalRootDirectory;
			file.checkDir(name, 'learnEnglish')
				  .then(_ => {
					console.log('Directory exists');
				  })
				  .catch(err => { 
					console.log('Directory doesnt exist');
					file.createDir(name, 'learnEnglish', false)
					.then(
					  (files) => {
						// do something
						console.log("success");
					  }
					).catch(
					  (err) => {
						// do something
						console.log("error"); // i am invoking only this part
					  }
					);
				   });
		//this.filePath = cordova.file.dataDirectory;
	});
	//this.serverAddress = 'raznameh.com/appv2';
	this.serverAddress = 'en.raznameh.com/lenv1';
	this.version = '1.1.0';
	this.debug = true; 
	this.loginType = 'email';//mobile
    console.log('Hello SettingProvider Provider');
  }

}