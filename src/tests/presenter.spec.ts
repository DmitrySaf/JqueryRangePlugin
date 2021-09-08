import { sliderPresenter } from './index.spec';

beforeAll(() => {
    jest.spyOn(sliderPresenter, 'init');
    jest.spyOn(sliderPresenter.view, 'mouseDownHandler');
    jest.spyOn(sliderPresenter.model.changeDotValueObserver, 'attach');
});

describe('Controller', () => {
    it('Presenter calls view functions', () => {
        sliderPresenter.init();
        expect(sliderPresenter.view.mouseDownHandler).toHaveBeenCalled();
        expect(sliderPresenter.model.changeDotValueObserver.attach).toHaveBeenCalled();
    });
});
