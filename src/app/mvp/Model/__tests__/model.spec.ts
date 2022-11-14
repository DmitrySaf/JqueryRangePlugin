import Model from '../Model';
import { defaultOptions } from '../../../options';

const mockCoords = { from: 2001, to: 6000 };

describe('Model', () => {
  const model = new Model(defaultOptions);

  afterEach(() => {
    model.updateModelOptions(defaultOptions, mockCoords);
  });

  it('changes value types where needed', () => {
    model.updateModelOptions({
      ...defaultOptions,
      min: '123',
      max: undefined,
      from: null,
      to: 'asd',
      step: '-123',
      vertical: 123,
      double: null,
      scale: '123', 
      scaleFrequency: 'undefined',
      valuesDisplay: 'null'
    }, mockCoords);

    expect(model.options.min).toEqual(defaultOptions.min);
    expect(model.options.vertical).toBeFalsy();
  });

  it('changes "max" value if "min" value is greater than "max" value', () => {
    const options = { ...recievedOptions, min: 12000 };
    const model = new Model(options);

    expect(model.options.max).toEqual(model.options.min + 1);
  });

  it('changes "step" value if "min" value is greater than "max" value', () => {
    const options = { ...recievedOptions, min: 12000 };
    const model = new Model(options);

    expect(model.options.step).toEqual(1);
  });

  it('changes "step" value if it is below 0', () => {
    const options = { ...recievedOptions, step: -10 };
    const model = new Model(options);

    expect(model.options.step).toEqual(1);
  });

  it('changes "from" value when it is less than "min" value', () => {
    const options = { ...recievedOptions, from: 500, double: true };
    const model = new Model(options);

    expect(model.options.from).toEqual(model.options.min);
  });

  it('changes "to" value when it is greater than "max" value', () => {
    const options = { ...recievedOptions, to: 12000 };
    const model = new Model(options);

    expect(model.options.to).toEqual(model.options.max);
  });

  it('changes "to" value when it is less than "from" value', () => {
    const options = { ...recievedOptions, from: 5000, to: 4000 };
    const model = new Model(options);

    expect(model.options.to).toEqual(model.static.from);
  });

  it('changes "from" value when it is greater than "to" value', () => {
    const options = { ...recievedOptions, from: 5000, to: 4000 };
    const model = new Model(options);

    expect(model.options.from).toEqual(model.static.to);
  });

  it('corrects "static.from/to" value if it is undefined', () => {
    const options = { ...recievedOptions };
    const model = new Model(options);

    expect(model.static.from).toEqual(model.options.from);
    expect(model.static.to).toEqual(model.options.to);
  });

  it('changes "from" value equal to "min" if "double" is false', () => {
    const options = { ...recievedOptions, double: false };
    const model = new Model(options);

    expect(model.options.from).toEqual(model.options.min);
  });

  it('changes "frequancy" value if its too high or too low', () => {
    const options = {
      ...recievedOptions, scale: true, min: 0, max: 1000, step: 100, scaleFrequency: 20
    };
    const model = new Model(options);

    expect(model.options.scaleFrequency).toEqual(11);
  });

  it('triggers the "notify" function', () => {
    const model = new Model({ ...recievedOptions });
    jest.spyOn(model, 'updateModelOptions');
    jest.spyOn(model.updateModelOptionsObserver, 'notify');

    const staticExample = { from: 5000, to: 6000 };
    model.updateModelOptions(recievedOptions, staticExample);
    expect(model.updateModelOptionsObserver.notify).toHaveBeenCalled();
  });
});
