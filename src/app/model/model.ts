import { Event } from '../event';
import { IOptions, defaultOptions } from '../options';

class Model {
    public updateModelOptionsObserver: Event;

    from: number;

    to: number;

    private correctOptions: IOptions;

    get options() : IOptions { return { ...this.correctOptions }; }

    constructor(options: IOptions) {
        this.updateModelOptionsObserver = new Event();
        this.correctOptions = this.optionsCorrection(options);
    }

    updateModelOptions = (viewOptions : IOptions): void => {
        this.correctOptions = this.optionsCorrection(viewOptions);
        this.updateModelOptionsObserver.notify();
    };

    private optionsCorrection = (checkingOptions: IOptions) : IOptions => {
        const confirmedOptions = { ...checkingOptions };
        const {
            min,
            max,
            from,
            to,
            step,
        } = confirmedOptions;

        // replacing inappropriate values

        Object.keys(confirmedOptions).forEach((key) => {
            if ((key === 'double') || (key === 'vertical')) {
                if (typeof (confirmedOptions[key]) !== 'boolean') {
                    confirmedOptions[key] = defaultOptions[key];
                }
            } else if (!this.isNumber(confirmedOptions[key])) {
                confirmedOptions[key] = defaultOptions[key];
            }
        });

        // checking from values override

        if (step <= 0) confirmedOptions.step = 1;
        if (step > (max - min)) confirmedOptions.step = max - min;
        if (min >= max) confirmedOptions.max = min + confirmedOptions.step;

        confirmedOptions.to = this.correctDiapason(to, from, max);
        confirmedOptions.from = this.correctDiapason(from, min, max);
        // console.log(this.percentToValue(checkingOptions.from));
        return confirmedOptions;
    };

    private isNumber = (parameter: number | boolean): boolean => typeof (parameter) === 'number';

    /*     public getState(state: { from: number, to: number }): void {
        this.from = state.from;
        this.to = state.to;
    } */

    /*     private percentToValue = (percent: number): number => Math.round(
        (percent * (this.options.max - this.options.min) + this.options.min) / this.options.step,
    ) * this.options.step; */

    private correctDiapason = (value: number, min: number, max: number): number => {
        if (value <= min) { return min; }
        if (value >= max) { return max; }
        return value;
    };
}

export { Model };
