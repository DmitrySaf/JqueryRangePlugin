/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Model from '../Model';
import { defaultOptions } from '../../../options';

const mockCoords = { from: 2001, to: 6000 };

describe('Model', () => {
  const model = new Model(defaultOptions);
  jest.spyOn(model, 'updateModelOptions');

  afterEach(() => {
    model.updateModelOptions(defaultOptions, mockCoords);
  });

  it('changes value types where needed', () => {
    model.updateModelOptions({
      ...defaultOptions,
      min: '123' as any,
      max: undefined as any,
      from: null as any,
      to: 'asd' as any,
      step: '-123' as any,
      vertical: 123 as any,
      double: null as any,
      scale: '123' as any,
      scaleFrequency: 'undefined' as any,
      valuesDisplay: 'null' as any
    }, mockCoords);

    expect(model.options.min).toEqual(defaultOptions.min);
    expect(model.options.max).toEqual(defaultOptions.max);
    expect(model.options.from).toEqual(defaultOptions.min);
    expect(model.options.to).toEqual(defaultOptions.to);
    expect(model.options.step).toEqual(defaultOptions.step);
    expect(model.options.vertical).toEqual(defaultOptions.vertical);
    expect(model.options.double).toEqual(defaultOptions.double);
    expect(model.options.scale).toEqual(defaultOptions.scale);
    expect(model.options.scaleFrequency).toEqual(defaultOptions.scaleFrequency);
    expect(model.options.valuesDisplay).toEqual(defaultOptions.valuesDisplay);
  });

  it('changes "max" value if "min" value is greater than "max" value', () => {
    model.updateModelOptions({ ...defaultOptions, min: 12000, max: 11000 }, mockCoords);

    expect(model.options.max).toEqual(model.options.min + 1);
  });

  it('changes "step" value if "min" value is greater than "max" value', () => {
    model.updateModelOptions({ ...defaultOptions, min: 12000, max: 11000 }, mockCoords);

    expect(model.options.step).toEqual(1);
  });

  it('changes "step" value if it is below 0', () => {
    model.updateModelOptions({ ...defaultOptions, step: -10 }, mockCoords);

    expect(model.options.step).toEqual(1);
  });

  it('changes "from" value when it is less than "min" value', () => {
    model.updateModelOptions({ ...defaultOptions, from: -1000, min: 0 }, mockCoords);

    expect(model.options.from).toEqual(model.options.min);
  });

  it('changes "to" value when it is greater than "max" value', () => {
    model.updateModelOptions({ ...defaultOptions, to: 11000, max: 10000 }, mockCoords);

    expect(model.options.to).toEqual(model.options.max);
  });

  it('changes "from" value equal to "min" if "double" is false', () => {
    model.updateModelOptions({ ...defaultOptions, double: false }, mockCoords);

    expect(model.options.from).toEqual(model.options.min);
  });

  it('changes "scaleFrequency" if the value is more than available steps', () => {
    model.updateModelOptions({
      ...defaultOptions,
      scale: true,
      scaleFrequency: 25,
      min: 0,
      max: 1000,
      step: 100
    }, mockCoords);

    expect(model.options.scaleFrequency).toEqual(11);
  });

  it('changes "scaleFrequency" value if the value is below 1', () => {
    model.updateModelOptions({ ...defaultOptions, scale: true, scaleFrequency: 0 }, mockCoords);

    expect(model.options.scaleFrequency).toEqual(1);
  });

  it('triggers the "notify" function', () => {
    const mockFunc = jest.fn();

    model.updateModelOptionsObserver.attach(mockFunc);
    model.updateModelOptions(defaultOptions, mockCoords);
    expect(mockFunc).toHaveBeenCalled();
  });
});
