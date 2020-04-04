import { Component,  OnInit } from '@angular/core';
import * as moment from 'moment';

interface SessionDetails {
    title: string;
    startTime: number;
    endTime: number;
    startTimeFormatted: string;
    endTimeFormatted: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'guide-calendar';
    times = ['00:00am', '1:00am', '2:00am', '3:00am', '4:00am', '5:00am', '6:00am', '7:00am', '8:00am', '9:00am', '10:00am', '11:00am', '12:00pm', '1:00pm', '2:00pm', '3:00pm', '4:00pm', '5:00pm', '6:00pm', '7:00pm', '8:00pm', '9:00pm', '10:00pm', '11:00pm'];
    blueLineStyle: {};

    sessions: [SessionDetails] = [
        {
            title: 'The Title of the Session',
            startTime: 1585969200000,
            endTime: 1585972800000,
            startTimeFormatted: '',
            endTimeFormatted: ''
        }
    ];
    days = [];
    newSession = {
        title: '',
        startTime: '',
        endTime: ''
    };

    constructor() { }

    ngOnInit(): void {
        // populate days
        for (let i = 0; i < 7; i++) {
            const date = moment().startOf('week').add(i, 'day');

            this.days.push({
                date,
                startOfDay: date.clone().startOf('day').unix() * 1000,
                endOfDay: date.clone().endOf('day').unix() * 1000,
                sessions: [],
                isToday: date.isSame(moment(), 'day')
            });
        }

        // set blue line position
        setInterval(this.updateBlueLine, 1000);
        this.updateBlueLine();

        this.refreshDays();
    }

    updateBlueLine() {
        this.blueLineStyle = {
            left: `${(moment().hours() * 60 + moment().minutes()) * 3 + 100}px`
        };
    }

    addSession() {
        this.sessions.push({
            title: this.newSession.title,
            startTime: moment(this.newSession.startTime).unix() * 1000,
            endTime: moment(this.newSession.endTime).unix() * 1000,
            startTimeFormatted: moment(this.newSession.startTime).format('DD MMM YY HH:mm'),
            endTimeFormatted: moment(this.newSession.endTime).format('DD MMM YY HH:mm')
        });

        this.newSession = {
            title: '',
            startTime: '',
            endTime: ''
        };

        this.refreshDays();
    }

    refreshDays() {
        // reset each days sessions
        this.days.forEach(day => {
            day.sessions = [];
        });

        // add sessions to days
        this.sessions.forEach(session => {
            session.startTimeFormatted = moment(session.startTime).format('DD MMM YY HH:mm');
            session.endTimeFormatted = moment(session.endTime).format('DD MMM YY HH:mm');
            this.days.forEach(day => {
                if (day.startOfDay <= session.startTime && session.startTime <= day.endOfDay) {
                    day.sessions.push(session);
                }
            });
        });
    }
}
