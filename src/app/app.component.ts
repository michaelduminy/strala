import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Storage } from '@ionic/storage'
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';


@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
 
  rootPage: any

  constructor(platform: Platform, storage: Storage) {
    
    platform.ready().then(() => {

      let loggedIn = localStorage.getItem('loggedIn')
      if (loggedIn && loggedIn !== '' && loggedIn === 'true'){
        this.rootPage = HomePage
      } else {
        this.rootPage = LoginPage
      }
       
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
