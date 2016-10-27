import { Injectable } from '@angular/core'
import { Http, RequestOptions, Headers } from '@angular/http'
import { Storage } from '@ionic/storage'
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable'
import moment from 'moment'
import { Activity } from '../models/activity'
import { TypeSummary, RunSummary } from '../models/typeSummary'
import { Summary } from '../models/Summary'
import _ from 'lodash'

@Injectable()
export class Strava {

    constructor(public http: Http, public storage: Storage) {
    }

    isLoggedIn: boolean
    clientId = 1
    apiKey = ''
    data

    authFlow(): Promise<any> {
        return this.authorise()
            .then(result => this.exchangeToken(result))
    }

    processActivities(): Promise<any> {
        return this.getAccessToken()
            .then(token => this.fetchActivities(token))
            .then(activities => this.buildSummary(activities))
            .then(summary => this.persistSummary(summary));
    }

    private persistSummary(summary: Summary) {
        console.log(JSON.stringify(summary))

        this.storage.set('summary', summary);
    }

    private buildSummary(activities: Array<Activity>): any {
        console.log(JSON.stringify(activities));

        var groups = _.groupBy(activities, 'type');
        console.log(JSON.stringify(groups));

        var rides = groups['Ride'];
        var rideSummary = this.buildTypeSummary(rides)

        var runs = groups['Run'];
        var runSummary = this.buildTypeSummary(runs)

        var summary = new Summary([rideSummary, runSummary]);
        return summary;
    }

    fetchActivities(token: string): Promise<Array<Activity>> {
        var url = '/strava/athlete/activities';
        return new Promise((resolve, reject) => {

            let customHeaders = new Headers();
            customHeaders.set('Authorization', 'Bearer ' + token);

            //url = url + '?after=' + this.unixSeconds(-90, 'days');

            this.http.get(url, { headers: customHeaders })
                .map(res => res.json())
                .subscribe(
                    data => resolve(data),
                    error => reject(error)
                )
        })
    }

    private buildTypeSummary(activities: Array<Activity>): TypeSummary {
        if (!activities || activities.length < 1) return null;

        let averageNum = activities.length / 7;

        let averageDist = _.mean(_.map(activities, _.property('distance')));
        let averagePace = _.mean(_.map(activities, _.property('average_speed')));
        let topSpeed = <number>_.max(_.map(activities, _.property('max_speed')));
        let farthest = <number>_.max(_.map(activities, _.property('distance')));
        let longestTime = <number>_.max(_.map(activities, _.property('elapsed_time')));

        var randomActivity = _.sample(activities);
        if (randomActivity && randomActivity.type === 'Run') {
            var distanceInMetres = _.sumBy(activities, 'distance');
            var timeInMinutes = _.sumBy(activities, 'elapsed_time') / 60;

            // average vdot? per week? going with total for now
            var vdot = (-4.6 + (0.182258 * (distanceInMetres / timeInMinutes)) + (0.000104 * (distanceInMetres / timeInMinutes) * (distanceInMetres / timeInMinutes))) / (0.8 + (Math.exp(-0.012778 * timeInMinutes) * 0.1894394) + (Math.exp(-0.1932605 * timeInMinutes) * 0.2989558));

            return new RunSummary(averageNum, averageDist, averagePace, topSpeed, farthest, longestTime, vdot);
        }

        return new TypeSummary(averageNum, averageDist, averagePace, topSpeed, farthest, longestTime);
    }

    private unixSeconds(num, type) {
        return moment().add(num, type).unix();
    }

    private getAccessToken(): Promise<string> {
        console.log('getting access token')
        return this.storage.get('access_token');
    }

    private authorise(): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = 'https://www.strava.com/oauth/authorize?client_id=' + this.clientId + '&response_type=code&redirect_uri=http://localhost/token_exchange';
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

    private exchangeToken(code: string): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = '/api/strava-exchange';
            let data = JSON.stringify({
                code: code,
            });
            console.log(data)

            let customHeaders = new Headers();
            customHeaders.set('x-api-key', this.apiKey);
            customHeaders.set('content-type', 'application/json');

            this.http.post(url, data, { headers: customHeaders })
                .subscribe(data => {
                    this.data = data.json();
                    resolve(this.data);
                }, error => {
                    console.log('token exchange failed');
                    reject(error);
                })
        })
    }

}
