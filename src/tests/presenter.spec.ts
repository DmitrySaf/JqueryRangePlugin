import { sliderPresenter } from './index.spec';

beforeAll(() => {
    jest.spyOn(sliderPresenter, 'init');
    jest.spyOn(sliderPresenter, 'updateModelOptions');
    jest.spyOn(sliderPresenter, 'updateViewOptions');
    jest.spyOn(sliderPresenter.view.updateViewOptionsObserver, 'attach');
    jest.spyOn(sliderPresenter.model.updateModelOptionsObserver, 'attach');
});

describe('Controller', () => {
    it('Presenter calls view functions', () => {
        sliderPresenter.init();
        expect(sliderPresenter.view.updateViewOptionsObserver).toHaveBeenCalled();
        expect(sliderPresenter.model.updateModelOptionsObserver).toHaveBeenCalled();
    });
});
