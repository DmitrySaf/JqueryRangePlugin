import { Event } from '../event';
import { IOptions } from '../options';
import { defaultOptions } from '../options';

class Model {

    public updateModelOptionsObserver: Event;

    from: number;

    to: number;

    private _correctOptions: IOptions;

    get options() : IOptions { return { ...this._correctOptions }; }

    constructor(options: IOptions) {
        this.updateModelOptionsObserver = new Event();
        this._correctOptions = this.optionsCorrection(options);
    }

    updateModelOptions = (viewOptions : IOptions) => {
        this._correctOptions = this.optionsCorrection(viewOptions);
        this.updateModelOptionsObserver.notify();
    }

    private optionsCorrection = (checkingOptions: IOptions) : IOptions => {
        const confirmedOptions = { ...checkingOptions };
        let { min, max, from,  to, step } = confirmedOptions;

        //replacing inappropriate values

        for (let key in confirmedOptions) {
            if ((key == 'double') || (key == 'vertical')) {
                if (typeof(confirmedOptions[key]) != 'boolean') {
                    confirmedOptions[key] = defaultOptions[key]
                }
            } else if (!this.isNumber(confirmedOptions[key])) {
                confirmedOptions[key] = defaultOptions[key];
            }
        }

        //checking from values override

        if (step <= 0) confirmedOptions.step = 1;
        if (step > (max - min)) confirmedOptions.step = max - min;
        if (min >= max) confirmedOptions.max = min + confirmedOptions.step;
        //const localMax = confirmedOptions.to;
        //const localMin = confirmedOptions.from;

/*         if (confirmedOptions.from >= confirmedOptions.to) {
            confirmedOptions.from = to;
            //confirmedOptions.to = from;
            console.log(confirmedOptions.from, confirmedOptions.to);
        } 
        if (from < confirmedOptions.min) confirmedOptions.from = confirmedOptions.min;
        if (to < confirmedOptions.min) confirmedOptions.to = confirmedOptions.min;
        if (to > confirmedOptions.max) confirmedOptions.to = confirmedOptions.max; */


        confirmedOptions.to = this.correctDiapason(to, from, max);
        confirmedOptions.from = this.correctDiapason(from, min, max);
        //confirmedOptions.from = this.correctDiapason(from, min, localMax);
        //confirmedOptions.from = double ? this.correctDiapason(from, min, to) : this.correctDiapason(to, min, max);
/*         console.log(`def ${from} - ${to}`);
        console.log(`conf ${this.from} - ${this.to}`); */

        return confirmedOptions;
    }

    private isNumber = (parameter: number | boolean) : boolean => {
        return typeof(parameter) == 'number'
    }

    public getState(state: {from: number, to: number}){
        this.from = state.from;
        this.to = state.to;
    }

    private correctDiapason = (value: number, min: number, max: number): number => {
        if (value <= min) { return min }
        if (value >= max) { return max }
        return value
    }

}

export { Model };