import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Strava provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Strava {

  constructor(public http: Http) {
    console.log('Hello Strava Provider');
  }

isLoggedIn: boolean;
    clientId = 1;
    apiKey = '';
    data;

    authFlow(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.authorise().then(result => {
                console.log("Authorization code: " + result);
                this.exchangeToken(result).then(result => {
                    console.log("token exchanged", result)
                    resolve(result);
                }, error => {
                    console.log("token exchange failed")
                    console.log(error);
                    reject(error);
                })
            }, error => {
                console.log("authorisation failed")
                console.log(error);
                reject(error);
            })
        });
    }

    authorise(): Promise<string> {

        return new Promise((resolve, reject) => {
            let url = "https://www.strava.com/oauth/authorize?client_id=" + this.clientId + "&response_type=code&redirect_uri=http://localhost/token_exchange";
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

    exchangeToken(code: string): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = "/api/strava-exchange";
            let data = JSON.stringify({
                code: code,
            });
            console.log(data)

            let customHeaders = new Headers();
            customHeaders.set("x-api-key", this.apiKey);
            customHeaders.set("content-type", "application/json");

            this.http.post(url, data, { headers: customHeaders })
                .subscribe(data => {
                    this.data = data.json();
                    resolve(this.data);
                }, error => {
                    console.log("token exchange failed");
                    reject(error);
                })
        })
    }

}
