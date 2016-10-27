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
    this.stravaService.authFlow().then(result => this.displayLoggedIn(result))
      .then(x => this.stravaService.processActivities())
      .then(x => console.log('got activities'));
  }

  displayLoggedIn(obj: any): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log('logged in')
      this.storage.set('isLoggedIn', true);
      this.isLoggedIn = true;

      this.storage.set('access_token', obj.access_token)
      this.storage.set('profile', JSON.stringify(obj))

      this.name = obj.athlete.firstname + obj.athlete.lastname;
      resolve();
    })
  }
}