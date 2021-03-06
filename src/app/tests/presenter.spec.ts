import { Presenter } from '../mvp/presenter/presenter';
import { View } from '../mvp/view/view';
import { Model } from '../mvp/model/model';

const recievedOptions = {
    min: 2000,
    max: 11000,
    vertical: true,
    double: true,
    from: 5000,
    to: 6000,
    step: 100,
    scale: true,
    scaleFrequency: 4,
    valuesDisplay: true
};

const staticExample = { from: 5000, to: 6000 };

const model = new Model(recievedOptions);
const view = new View($('#range'), recievedOptions);
const presenter = new Presenter(view, model);

beforeAll(() => {
    jest.spyOn(presenter, 'init');
    jest.spyOn(presenter.view.updateViewOptionsObserver, 'attach');
    jest.spyOn(presenter.model.updateModelOptionsObserver, 'attach');
    jest.spyOn(model.updateModelOptionsObserver, 'notify');
    jest.spyOn(presenter, 'updateModelOptions');
});

describe('Controller', () => {
    it('presenters function "init" attaches view and model to observer', () => {
        presenter.init();
        expect(presenter.view.updateViewOptionsObserver.attach).toHaveBeenCalled();
        expect(presenter.model.updateModelOptionsObserver.attach).toHaveBeenCalled();
    });

    it('presenters function "updateModelOptions" triggers the "notify" function', () => {
        presenter.updateModelOptions(view.currentOptions, staticExample);
        expect(model.updateModelOptionsObserver.notify).toHaveBeenCalled();
    });
});
