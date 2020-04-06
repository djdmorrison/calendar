import { Component,  OnInit } from '@angular/core';
import * as moment from 'moment';

interface SessionDetails {
    title: string;
    startTime: number;
    endTime: number;
    overlapping?: any[];
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

    sessions: SessionDetails[] = [
        {
            title: 'ABC',
            startTime: 1586138400000,
            endTime: 1586142000000,
        },
        {
            title: 'First Session',
            startTime: 1586134800000,
            endTime: 1586138400000,
        },
        {
            title: 'Second Session',
            startTime: 1586137500000,
            endTime: 1586140200000,
        },
        {
            title: 'Another Session',
            startTime: 1586138700000,
            endTime: 1586140500000,
        },
        {
            title: 'The Title of the Session',
            startTime: 1586142000000,
            endTime: 1586145600000,
        },
        {
            title: 'ITSM',
            startTime: 1586141100000,
            endTime: 1586142900000,
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
            day.numOverlappedSessions = 1;
        });

        this.sessions.sort((a, b) => {
            return a.startTime > b.startTime ? 1 : -1;
        });

        // add sessions to days
        this.sessions.forEach(session => {
            session.overlapping = [];
            this.days.forEach(day => {
                if (day.startOfDay <= session.startTime && session.startTime <= day.endOfDay) {

                    day.sessions.forEach(daySession => {
                        day.numOverlappedSessions = 2;

                        if (this.checkOverlap(daySession, session)) {
                            session.overlapping.push(daySession);
                        }
                    });

                    day.sessions.push(session);
                }


            });
        });

        this.days.forEach(day => {
            const overlappingSessions = [];
            day.sessions.forEach(daySession => {

                if (daySession.overlapping.length === 1) {
                    overlappingSessions.push(daySession);
                    if (overlappingSessions.length > 1) {
                        if (overlappingSessions[0].startTime < daySession.startTime && daySession.startTime < overlappingSessions[0].endTime) {
                            day.numOverlappedSessions = 3;
                            daySession.overlapping.push(overlappingSessions[0]);
                        }
                    }
                }
            });
        });
    }

    checkOverlap(prevSession, session) {
        if (prevSession.overlapping.length) {
            if (prevSession.startTime < session.startTime && session.startTime < prevSession.endTime) {
                let overlappingFinished = false;

                prevSession.overlapping.forEach(overlappingSession => {
                    if (overlappingSession.endTime <= session.startTime) {
                        overlappingFinished = true;
                    }
                });

                return !overlappingFinished;
            }
            return false;

        }
        else {
            return prevSession.startTime < session.startTime && session.startTime < prevSession.endTime;
        }
    }
}
