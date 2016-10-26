import { Component } from '@angular/core';
import { InAppBrowser } from 'ionic-native';
import { Http, RequestOptions, Headers } from '@angular/http';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Strava } from '../../providers/strava'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  isLoggedIn: boolean;
  name: string;

  constructor(public navCtrl: NavController, public storage: Storage, private stravaService: Strava) { };

  authWithStrava(): void {
    this.stravaService.authFlow().then(result => {
       console.log('logged in')
       this.storage.set('isLoggedIn', true);
       this.isLoggedIn = true;

       this.name = result.athlete.firstname + result.athlete.lastname;
    });
  }
}