import { Event } from '../event';
import { IOptions, defaultOptions } from '../options';

class Model {
    public updateModelOptionsObserver: Event;

    private correctOptions: IOptions;

    public stateOptions: { from: number, to: number }

    get options() : IOptions { return { ...this.correctOptions }; }

    get state() { return this.stateOptions }

    constructor(options: IOptions) {
        this.updateModelOptionsObserver = new Event();
        this.stateOptions = { from: options.from, to: options.to };
        this.stateOptions = { from: this.optionsCorrection(options).from, to: this.optionsCorrection(options).to }
        this.correctOptions = this.optionsCorrection(options);
    }

    updateModelOptions = (viewOptions : IOptions, modelState: { from: number, to: number }): void => {
        this.correctOptions = this.optionsCorrection(viewOptions);
        this.stateOptions = { ...modelState };
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
        confirmedOptions.to = to > confirmedOptions.max ? confirmedOptions.max : confirmedOptions.to
        confirmedOptions.to = to < this.stateOptions.from ? from : confirmedOptions.to
        confirmedOptions.from = from < confirmedOptions.min ? confirmedOptions.min : confirmedOptions.from
        confirmedOptions.from = from > this.stateOptions.to ? to : confirmedOptions.from
        //console.log(this.stateOptions.from, this.stateOptions.to)
        return confirmedOptions;
    };

    private isNumber = (parameter: number | boolean): boolean => typeof (parameter) === 'number';
}

export { Model };
