import { View } from '../app/view';

const view : View = new View($('.container'));

beforeEach(() => {
    jest.spyOn(view, 'init');
    jest.spyOn(view, 'appendSlider');
    jest.spyOn(view, 'addClasses');
});

describe('View', () => {
    it('check for main functions to be called', () => {
        view.init();
        expect(view.addClasses).toHaveBeenCalled();
        expect(view.appendSlider).toHaveBeenCalled();
    });
});
