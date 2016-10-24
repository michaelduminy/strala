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
  client_id = 9;
  client_secret = "test";
  data = {
    response: ""
  };

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
      var url = "https://www.strava.com/oauth/token";
      var data = JSON.stringify({
        client_id: this.client_id,
        client_secret: this.client_secret,
        code: code,
      })
      console.log(data);

      let headers = new Headers();
      headers.append("Access-Control-Allow-Origin","https://www.strava.com")
      let options = new RequestOptions({headers: headers});
      
      this.http.post(url, data, options).subscribe(data => {
        console.log(data);
        //this.data.response = data.json;
        resolve();
      }, error => {
        debugger;
        console.log("Ooops");
        console.log(error);
        reject(error);
      })
    })
  }

  authorise(): Promise<string> {

    return new Promise((resolve, reject) => {
      var url = "https://www.strava.com/oauth/authorize?client_id=" + this.client_id + "&response_type=code&redirect_uri=http://localhost/token_exchange";
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