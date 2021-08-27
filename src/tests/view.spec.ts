import { View } from '../app/view';

const view : View = new View($('.container'), {min: 100, double: true});

beforeEach(() => {
    jest.spyOn(view, 'init');
    jest.spyOn(view, 'appendSlider');
});

describe('View', () => {
    it('check for main functions to be called', () => {
        view.init();
        expect(view.appendSlider).toHaveBeenCalled();
    });
});
