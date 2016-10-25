import { Component } from '@angular/core';
import { InAppBrowser } from 'ionic-native';
import { Http, RequestOptions, Headers } from '@angular/http';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  isLoggedIn: boolean;
  clientId = 1;
  apiKey = '';
  data;

  constructor(public navCtrl: NavController, private http: Http) {
    this.isLoggedIn = false;
    this.http = http;
  }

  authWithStrava(): void {
    this.authorise().then(result => {
      console.log("Authorization code: " + result);
      this.exchangeToken(result).then(result => {
        console.log(result);
      }, error => {
        console.log(error);
      })
    }, error => {
      console.log(error);
    })
  }

  exchangeToken(code: string): Promise<string> {
    return new Promise((resolve, reject) => {
      var url = "/api/strava-exchange";
      var data = JSON.stringify({
        code: code,
      });

      let customHeaders = new Headers();
      customHeaders.set("x-api-key", this.apiKey);
      customHeaders.set("content-type", "application/json");

      this.http.post(url, data, { headers: customHeaders })
        .subscribe(data => {
          this.data = data.json;
          console.log(this.data.access_token);
          this.isLoggedIn = true;
          resolve();
        }, error => {
          console.log("token exchange failed");
          reject(error);
        })
    })
  }

  authorise(): Promise<string> {

    return new Promise((resolve, reject) => {
      var url = "https://www.strava.com/oauth/authorize?client_id=" + this.clientId + "&response_type=code&redirect_uri=http://localhost/token_exchange";
      let browserRef = window.open(url, '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');
      browserRef.addEventListener('loadstart', (event) => {
        let url: string = (<any>event).url;
        console.log(url)
        let redirect_url = url.split('?');
        if (redirect_url[0] != 'http://localhost/token_exchange') {
          return
        }

        console.log('approved!', event)

        browserRef.removeEventListener('exit', (event) => { });
        browserRef.close();

        let params = redirect_url[1];
        let code = params.split('=')[2];
        resolve(code);
      })

      browserRef.addEventListener('exit', (event) => {
        reject('The sign in flow was canceled');
      });
    });
  }

}