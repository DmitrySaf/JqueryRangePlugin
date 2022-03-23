import { Event } from '../event';
import { IOptions, defaultOptions, Coords } from '../options';

class Model {
    public updateModelOptionsObserver: Event;

    private staticOptions: Coords;

    private optionsSec: IOptions;

    private correctOptions: IOptions;

    get options(): IOptions { return this.correctOptions; }

    get static(): Coords { return this.staticOptions; }

    constructor(options: IOptions) {
        this.updateModelOptionsObserver = new Event();
        this.optionsSec = options;
        this.staticOptions = { from: options.from, to: options.to };
        this.correctOptions = this.optionsCorrection(options);
    }

    updateModelOptions = (
        viewOptions : IOptions,
        modelStatic: Coords
    ): void => {
        this.correctOptions = this.optionsCorrection(viewOptions);
        this.staticOptions = { ...modelStatic };
        this.updateModelOptionsObserver.notify();
    };

    private optionsCorrection = (checkingOptions: IOptions) : IOptions => {
        const confirmedOptions = { ...checkingOptions };

        // Check for inappropriate values
        Object.keys(checkingOptions).forEach((key) => {
            if ((key === 'double') || (key === 'vertical')) {
                if (typeof (checkingOptions[key]) !== 'boolean') {
                    checkingOptions[key] = defaultOptions[key];
                }
            } else if (!this.isNumber(checkingOptions[key])) {
                checkingOptions[key] = defaultOptions[key];
            }
        });

        // Change invalid step and minmax
        confirmedOptions.step = (checkingOptions.step < 1) ? 1 : checkingOptions.step;
        if (checkingOptions.min >= checkingOptions.max) {
            confirmedOptions.max = checkingOptions.min + 1;
            confirmedOptions.step = 1;
        }

        this.correctStaticOptions(confirmedOptions.min, confirmedOptions.max);

        // Change values overriding each other
        confirmedOptions.to = (checkingOptions.to > confirmedOptions.max)
            ? confirmedOptions.max
            : confirmedOptions.to;

        confirmedOptions.to = (checkingOptions.to < this.staticOptions.from)
            ? this.staticOptions.from
            : confirmedOptions.to;

        confirmedOptions.from = (checkingOptions.from < confirmedOptions.min)
            ? confirmedOptions.min
            : confirmedOptions.from;

        confirmedOptions.from = (checkingOptions.from > this.staticOptions.to)
            ? this.staticOptions.to
            : confirmedOptions.from;

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
