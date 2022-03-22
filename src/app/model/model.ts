import { Event } from '../event';
import { IOptions, defaultOptions } from '../options';

class Model {
    public updateModelOptionsObserver: Event;

    private staticOptions: {from: number, to: number}

    private optionsSec: IOptions

    private correctOptions: IOptions;

    get options() : IOptions { return this.correctOptions }
    
    get static() { return this.staticOptions }

    constructor(options: IOptions) {
        this.updateModelOptionsObserver = new Event();
        this.optionsSec = options;
        this.staticOptions = { from: options.from, to: options.to };
        this.correctOptions = this.optionsCorrection(options);
    }

    updateModelOptions = (viewOptions : IOptions, modelStatic: { from: number, to: number }): void => {
        this.correctOptions = this.optionsCorrection(viewOptions);
        this.staticOptions = { ...modelStatic };
        this.updateModelOptionsObserver.notify();
    };

    private optionsCorrection = (checkingOptions: IOptions) : IOptions => {
        const confirmedOptions = { ...checkingOptions };

        this.correctValueTypes(confirmedOptions);
        confirmedOptions.step = this.correctStep(checkingOptions.step, checkingOptions.min, checkingOptions.max);
        confirmedOptions.max = this.correctMinMax(checkingOptions.min, checkingOptions.max);
        this.correctStaticOptions(checkingOptions.min, checkingOptions.max);
        // checking for values override
        confirmedOptions.to = (checkingOptions.to > confirmedOptions.max) ? confirmedOptions.max : confirmedOptions.to;
        confirmedOptions.to = (checkingOptions.to < this.staticOptions.from) ? this.staticOptions.from : confirmedOptions.to;

        confirmedOptions.from = (checkingOptions.from < confirmedOptions.min) ? confirmedOptions.min : confirmedOptions.from;
        confirmedOptions.from = (checkingOptions.from > this.staticOptions.to) ? this.staticOptions.to : confirmedOptions.from;
        return confirmedOptions;
    };

    private isNumber = (parameter: number | boolean): boolean => typeof (parameter) === 'number';

    private correctStaticOptions = (min: number, max: number): void => {
        if (this.staticOptions.from === undefined) {
            this.staticOptions.from = this.optionsSec.from
        }
        this.staticOptions.from = (this.staticOptions.from < min) ? min : this.staticOptions.from;

        if (this.staticOptions.to === undefined) {
            this.staticOptions.to = this.optionsSec.to
        }
        this.staticOptions.to = (this.staticOptions.to > max) ? max : this.staticOptions.to;
    }

    private correctStep = (step: number, min: number, max: number): number => {
        if (min >= max) {
            step = 1
        } else if (step > (max - min)) {
            step = max - min
        }
        if (step <= 0) step = 1;
        return step;
    }

    private correctMinMax = (min: number, max: number): number => {
        if (min >= max) return (min + 1)
        return max;
    }

    private correctValueTypes = (options: IOptions): void => {
        Object.keys(options).forEach((key) => {
            if ((key === 'double') || (key === 'vertical')) {
                if (typeof (options[key]) !== 'boolean') {
                    options[key] = defaultOptions[key];
                }
            } else if (!this.isNumber(options[key])) {
                options[key] = defaultOptions[key];
            }
        });
    }
}

export { Model };
