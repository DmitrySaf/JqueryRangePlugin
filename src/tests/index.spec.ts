import { Model } from '../app/model/model';
import { Presenter } from '../app/presenter/presenter';
import { View } from '../app/view/view';
import { IOptions } from '../app/options';

(function ($) {
    $.fn.slider = function (options: IOptions) {
        let settings = $.extend({
            min: 0,
            max: 10000,
            double: false
        }, options)
        let model = new Model(settings);
        let view = new View(this, model.options);
        let presenter = new Presenter(view, model)
        return presenter;
    };
}(jQuery));

const sliderPresenter = $('#range').slider({
    double: true
});
const sliderView = sliderPresenter.view;
const sliderModel = sliderPresenter.model;

describe('plugin initialization', () => {
    it('plugin is initialized', () => {
        expect( $.fn.slider ).toBeDefined();
    })
})

export { sliderPresenter, sliderView, sliderModel }