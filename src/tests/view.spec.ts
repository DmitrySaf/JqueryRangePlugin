//import { View } from '../app/view/view';

beforeAll(() => {
/*     jest.spyOn(viewT, 'init');
    jest.spyOn(viewT, 'createSlider');
    jest.spyOn(viewT, 'render');
    jest.spyOn(viewT, 'addEventListeners'); */
});

/* const recievedOptions = {
    min: 2000,
    max: 11000,
    vertical: false,
    double: false,
    from: 5000,
    to: 6000,
    step: 100
}

describe('View', () => {
    beforeEach(() => {
        $('<input/>').attr( {id: 'range'} ).appendTo($('body'));
    })

    afterEach(() => {
        $('body').empty();
    })

    it('creates a slider above the input', () => {
        const input = $('input[id="range"]');
        const view = new View(input, recievedOptions);

        expect(input.prev().hasClass('slider')).toBeTruthy();
    });

    it('gives input a class "hidden"', () => {
        const input = $('input[id="range"]');
        const view = new View(input, recievedOptions);

        expect(input.hasClass('hidden')).toBeTruthy();
    });

    it('slider has all elements in it', () => {
        const input = $('input[id="range"]');
        const view = new View(input, recievedOptions);
        const slider = input.prev();

        expect(slider.find('.slider__bar').length).toEqual(1);
        expect(slider.find('.slider__filler').length).toEqual(1);
        expect(slider.find('.slider__dot_wrapper_first').length).toEqual(1);
        expect(slider.find('.slider__dot').length).toEqual(2);
        expect(slider.find('.slider__dot_first_value').length).toEqual(1);
        expect(slider.find('.slider__min').length).toEqual(1);
    });

    it('adds class "shown" if option "double" is true', () => {
        const input = $('input[id="range"]');
        const options = { ...recievedOptions, double: true } 
        const view = new View(input, options);
        const slider = input.prev();

        expect(slider.find('.slider__dot_wrapper_first').hasClass('shown')).toBeTruthy();
    });

    it('adds verical classes if options "vertical" is true', () => {
        const input = $('input[id="range"]');
        const options = { ...recievedOptions, vertical: true } 
        const view = new View(input, options);
        const slider = input.prev();

        expect(slider.find('.slider__bar').hasClass('slider__bar_vertical')).toBeTruthy();
        expect(slider.find('.slider__min').hasClass('slider__min_vertical')).toBeTruthy();
    });

    it('checks the coords into value calcuation', () => {
        const input = $('input[id="range"]');
        const coordsExample = { pageX: 600, pageY: 400 };
        const view = new View(input, recievedOptions);

        //expect(view.getValueOfDot(coordsExample)).toEqual
    });

    it('toggles the min-max elements hide class depends on the value', () => {
        const input = $('input[id="range"]');
        const optoinsExample = { ...recievedOptions, min: 0, from: 1, double: true };
        const view = new View(input, optoinsExample);
        const slider = input.prev();

        expect(slider.find('.slider__min').hasClass('hidden')).toBeTruthy();
    });

    it('shows correct current values above the dot', () => {
        const input = $('input[id="range"]');
        const optoinsExample = { ...recievedOptions, from: 2000, to: 11000, double: true };
        const view = new View(input, optoinsExample);
        const slider = input.prev();

        expect(+slider.find('.slider__dot_first_value').text()).toEqual(view.currentOptions.from);
        expect(slider.find('.slider__dot_second_value').text()).toEqual(view.currentOptions.to);
    })

}); */
