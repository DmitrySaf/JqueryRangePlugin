import Event from '../../Event';
import {
  IDefinedOptions,
  defaultOptions,
  Coords
} from '../../options';

class Model {
  public updateModelOptionsObserver: Event;

  private correctOptions: IDefinedOptions;

  private staticOptions: Coords;

  private optionsSec: IDefinedOptions;

  get options(): IDefinedOptions { return this.correctOptions; }

  get static(): Coords { return this.staticOptions; }

  get position(): Coords { return this.valueToPercent(); }

  constructor(options: IDefinedOptions) {
    this.updateModelOptionsObserver = new Event();
    this.optionsSec = options;
    this.staticOptions = { from: options.from, to: options.to };
    this.correctOptions = this.optionsCorrection(options);
  }

  public updateModelOptions = (
    viewOptions: IDefinedOptions,
    modelStatic: Coords
  ): void => {
    this.correctOptions = this.optionsCorrection(viewOptions);
    this.staticOptions = { ...modelStatic };
    this.updateModelOptionsObserver.notify();
  };

  private optionsCorrection = (checkingOptions: IDefinedOptions): IDefinedOptions => {
    const confirmedOptions = { ...checkingOptions };

    Object.keys(checkingOptions).forEach((key) => {
      if ((key === 'double') || (key === 'vertical') || (key === 'scale') || (key === 'valuesDisplay')) {
        if (typeof (checkingOptions[key]) !== 'boolean') {
          confirmedOptions[key] = defaultOptions[key];
        }
      } else if (!this.isNumber(checkingOptions[key])) {
        confirmedOptions[key] = defaultOptions[key];
      }
    });

    if (checkingOptions.step <= 0) confirmedOptions.step = 1;
    if (checkingOptions.min >= checkingOptions.max) {
      confirmedOptions.max = checkingOptions.min + 1;
      confirmedOptions.step = 1;
    }
    if (confirmedOptions.scale) {
      if (checkingOptions.scaleFrequency < 1) confirmedOptions.scaleFrequency = 1;
      if (checkingOptions.scaleFrequency
        > (((confirmedOptions.max - confirmedOptions.min) / confirmedOptions.step) + 1)) {
        confirmedOptions.scaleFrequency = Math.round(
          (confirmedOptions.max - confirmedOptions.min) / confirmedOptions.step
        ) + 1;
      }
    }

    this.correctStaticOptions(confirmedOptions.min, confirmedOptions.max);

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

  private valueToPercent = () => {
    const {
      min,
      max,
      from,
      to
    } = this.correctOptions;
    return {
      from: ((from - min) / (max - min)) * 100,
      to: ((to - min) / (max - min)) * 100
    };
  };
}

export default Model;
