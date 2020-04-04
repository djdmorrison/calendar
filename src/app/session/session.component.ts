import { Component, OnInit, Input, ViewChild } from '@angular/core';
import * as moment from 'moment';

interface SessionDetails {
    title: string;
    startTime: number;
    endTime: number;
    startTimeFormatted: string;
    endTimeFormatted: string;
}

@Component({
    selector: 'app-session',
    templateUrl: './session.component.html',
    styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {
    @Input() details: SessionDetails;

    startTimeFormatted: string;
    endTimeFormatted: string;

    style: {};

    constructor() { }

    ngOnInit(): void {
        this.startTimeFormatted = moment(this.details.startTime).format('HH:mma');
        this.endTimeFormatted = moment(this.details.endTime).format('HH:mma');

        const sinceStartOfDay = moment(this.details.startTime).hour() * 60 + moment(this.details.startTime).minutes();

        const sessionLength = (moment(this.details.endTime).unix() - moment(this.details.startTime).unix()) / 60;

        this.style = {
            left: `${sinceStartOfDay * 3}px`,
            width: `${sessionLength * 3}px`
        };
    }
}
