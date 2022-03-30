/* eslint-disable @typescript-eslint/no-unused-vars */
import { View } from '../app/view/view';

const recievedOptions = {
    min: 2000,
    max: 11000,
    vertical: false,
    double: false,
    from: 5000,
    to: 6000,
    step: 100
};

describe('View', () => {
    beforeEach(() => {
        $('<input/>').attr({ id: 'range' }).appendTo($('body'));
    });

    afterEach(() => {
        $('body').empty();
    });

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
        const options = { ...recievedOptions, double: true };
        const view = new View(input, options);
        const slider = input.prev();

        expect(slider.find('.slider__dot_wrapper_first').hasClass('shown')).toBeTruthy();
    });

    it('adds verical classes if options "vertical" is true', () => {
        const input = $('input[id="range"]');
        const options = { ...recievedOptions, vertical: true };
        const view = new View(input, options);
        const slider = input.prev();

        expect(slider.find('.slider__bar').hasClass('slider__bar_vertical')).toBeTruthy();
        expect(slider.find('.slider__min').hasClass('slider__min_vertical')).toBeTruthy();
    });

    it('toggles the min-max elements hide class depends on the value', () => {
        const input = $('input[id="range"]');
        const optoinsExample = {
            ...recievedOptions, min: 0, from: 1, double: true
        };
        const view = new View(input, optoinsExample);
        const slider = input.prev();

        expect(slider.find('.slider__min').hasClass('hidden')).toBeTruthy();
    });

    it('shows correct current values above the dot', () => {
        const input = $('input[id="range"]');
        const view = new View(input, { ...recievedOptions });
        const slider = input.prev();

        expect(+slider.find('.slider__dot_first_value').text()).toBe(view.checkedOptions.from);
    });

    it('static options are equal to checked "from" and "to" options', () => {
        const input = $('input[id="range"]');
        const view = new View(input, { ...recievedOptions });

        expect(view.modelStatic.from).toEqual(view.checkedOptions.from);
        expect(view.modelStatic.to).toEqual(view.checkedOptions.to);
    });

    it('updateViewOptions method changes all options', () => {
        const input = $('input[id="range"]');
        const view = new View(input, { ...recievedOptions });
        jest.spyOn(view, 'updateViewOptions');
        const optoinsExample = { ...recievedOptions, from: 4000, to: 6000 };
        const modelStaticExample = { from: 5000, to: 6000 };

        // check for equality before change
        expect(view.checkedOptions).toEqual({ ...recievedOptions });
        expect(view.currentOptions).toEqual({ ...recievedOptions });
        expect(view.modelStatic).toEqual({ from: recievedOptions.from, to: recievedOptions.to });

        // new data uploaded
        view.updateViewOptions(optoinsExample, modelStaticExample);

        // check for equality after new data
        expect(view.checkedOptions).toEqual(optoinsExample);
        expect(view.currentOptions).toEqual(optoinsExample);
        expect(view.modelStatic).toEqual(modelStaticExample);
    });
});
