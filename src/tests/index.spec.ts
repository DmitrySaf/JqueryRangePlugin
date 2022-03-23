/* import { Model } from '../app/model/model';
import { Presenter } from '../app/presenter/presenter';
import { View } from '../app/view/view';
import { IOptions } from '../app/options';

(function Declare($) {
    $.fn.slider = function Slider(options: IOptions) {
        const settings = $.extend({
            min: 0,
            max: 10000,
            double: false,
        }, options);
        const model = new Model(settings);
        const view = new View(this, model.options);
        const presenter = new Presenter(view, model);
        return presenter;
    };
}(jQuery));

const options = {
    min: 2000,
    max: 11000,
    vertical: true,
    double: true,
    from: 5000,
    to: 7000,
    step: -11,
};

const sliderPresenter = $('#range').slider(options);
const sliderView = sliderPresenter.view;
const sliderModel = sliderPresenter.model;

describe('plugin initialization', () => {
    it('plugin is initialized', () => {
        expect(sliderPresenter).toBeDefined();
    });
});

export {
    sliderPresenter, sliderView, sliderModel, options,
}; */
