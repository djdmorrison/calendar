import { Component, OnInit, Input, ViewChild } from '@angular/core';
import * as moment from 'moment';

interface SessionDetails {
    title: string;
    startTime: number;
    endTime: number;
    overlapping?: any[];
}

@Component({
    selector: 'app-session',
    templateUrl: './session.component.html',
    styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {
    @Input() details: SessionDetails;
    sinceStartOfDay;
    sessionLength;

    constructor() { }

    ngOnInit(): void {
        this.sinceStartOfDay = moment(this.details.startTime).hour() * 60 + moment(this.details.startTime).minutes();
        this.sessionLength = (moment(this.details.endTime).unix() - moment(this.details.startTime).unix()) / 60;
    }
}
