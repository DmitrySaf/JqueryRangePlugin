import { Event } from '../../event';
import { IOptions, defaultOptions, Coords } from '../../options';

class Model {
    public updateModelOptionsObserver: Event;

    private correctOptions: IOptions;

    private staticOptions: Coords;

    private optionsSec: IOptions;

    get options(): IOptions { return this.correctOptions; }

    get static(): Coords { return this.staticOptions; }

    constructor(options: IOptions) {
        this.updateModelOptionsObserver = new Event();
        this.optionsSec = options;
        this.staticOptions = { from: options.from, to: options.to };
        this.correctOptions = this.optionsCorrection(options);
    }

    public updateModelOptions = (
        viewOptions: IOptions,
        modelStatic: Coords
    ): void => {
        this.correctOptions = this.optionsCorrection(viewOptions);
        this.staticOptions = { ...modelStatic };
        this.updateModelOptionsObserver.notify();
        console.log(this.correctOptions);
    };

    private optionsCorrection = (checkingOptions: IOptions) : IOptions => {
        const confirmedOptions = { ...checkingOptions };

        // Check for inappropriate values
        Object.keys(checkingOptions).forEach((key) => {
            if ((key === 'double') || (key === 'vertical') || (key === 'scale')) {
                if (typeof (checkingOptions[key]) !== 'boolean') {
                    confirmedOptions[key] = defaultOptions[key];
                }
            } else if (!this.isNumber(checkingOptions[key])) {
                confirmedOptions[key] = defaultOptions[key];
            }
        });

        // Change invalid property value
        if (checkingOptions.step < 1) confirmedOptions.step = 1;
        if (checkingOptions.min >= checkingOptions.max) {
            confirmedOptions.max = checkingOptions.min + 1;
            confirmedOptions.step = 1;
        }
        if (checkingOptions.scaleFrequency < 1) confirmedOptions.scaleFrequency = 1;
        if (checkingOptions.scaleFrequency > (confirmedOptions.max - confirmedOptions.min + 1)) confirmedOptions.scaleFrequency = confirmedOptions.max - confirmedOptions.min + 1;

        this.correctStaticOptions(confirmedOptions.min, confirmedOptions.max);

        // Change values overriding each other
        if (confirmedOptions.double) {
            if (checkingOptions.from < confirmedOptions.min) confirmedOptions.from = confirmedOptions.min;
            if (checkingOptions.from > this.staticOptions.to) confirmedOptions.from = this.staticOptions.to;
        } else {
            confirmedOptions.from = confirmedOptions.min;
            this.staticOptions.from = confirmedOptions.min;
        }
        if (checkingOptions.to > confirmedOptions.max) confirmedOptions.to = confirmedOptions.max;
        if (checkingOptions.to < this.staticOptions.from) confirmedOptions.to = this.staticOptions.from;

        return confirmedOptions;
    };

    private correctStaticOptions = (min: number, max: number): void => {
        this.staticOptions.from = this.ifUndefined(this.staticOptions.from, 'from');
        this.staticOptions.to = this.ifUndefined(this.staticOptions.to, 'to');

        this.staticOptions.from = this.isInDiapason(min, max, this.staticOptions.from);
        this.staticOptions.to = this.isInDiapason(min, max, this.staticOptions.to);
    };

    private isNumber = (parameter: number | boolean): boolean => typeof (parameter) === 'number';

    private ifUndefined = (
        option: number | undefined,
        optionName: 'from' | 'to'
    ): number => (option || this.optionsSec[optionName]);

    private isInDiapason = (
        min: number,
        max: number,
        value: number
    ): number => (((value < min) || (value > max)) ? min : value);
}

export { Model };
