import { Event } from '../event';
import '../options';

class Model {

    changeDotValueObserver: Event;

    dotFirstValue: number;

    clearedOptions: IOptions;

    defaultOptions: IOptions;

    dotSecondValue: number;

    constructor(defaultOptions: IOptions) {
        this.changeDotValueObserver = new Event();
        this.defaultOptions = defaultOptions;
        this.clearedOptions = this.correctedOptions(defaultOptions);
        console.log(this.clearedOptions);
    }

    changeDotValue = (dotSecondValue: number, dotFirstValue : number = 0) => {
        this.dotFirstValue = dotFirstValue;
        this.dotSecondValue = dotSecondValue;
        this.changeDotValueObserver.notify();
    }

    correctedOptions = (checkingOptions: IOptions) => {
        const confirmedOptions = {...checkingOptions};
        const { min, max, from, to,/*  vertical, double, */ step } = confirmedOptions;
        const isNumber = (typeof(min) == 'number') && (typeof(max) == 'number') && (typeof(from) == 'number') && (typeof(to) == 'number') && (typeof(step) == 'number');

        if (isNumber) {
            (min > max) ? (confirmedOptions.min = max) : (confirmedOptions.min = min);

            (max < min) ? (confirmedOptions.max = min) : (confirmedOptions.max = max);
        } else {
            confirmedOptions.min = this.defaultOptions.min;
            confirmedOptions.max = this.defaultOptions.max;
            confirmedOptions.to = this.defaultOptions.to;
            confirmedOptions.from = this.defaultOptions.from;
            confirmedOptions.step = this.defaultOptions.step;
            console.log('done');
        }
        
/* 
        (from > to) ? (from = to) : (from = from);

        (to < from) ? (to = from) : (to = to);

        (typeof(vertical) != 'boolean') ? (vertical = false) : (vertical = true); */

        return confirmedOptions;
    }


}

export { Model };