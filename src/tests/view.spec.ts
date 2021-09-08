import { sliderView } from './index.spec';

beforeEach(() => {
    jest.spyOn(sliderView, 'init');
    jest.spyOn(sliderView, 'appendSlider');
    jest.spyOn(sliderView, 'elemsInit');
    jest.spyOn(sliderView, 'render');
});

describe('View', () => {

    it('check for main functions to be called', () => {
        sliderView.init();
        expect(sliderView.appendSlider).toHaveBeenCalled();
        expect(sliderView.elemsInit).toHaveBeenCalled();
        expect(sliderView.render).toHaveBeenCalled();
    });

    it ('check all the default options', () => {
        const options = sliderView.options;
        expect(options.min).toBe(0);
        expect(options.max).toBe(10000);
        expect(options.double).toBe(true);
    })
});
