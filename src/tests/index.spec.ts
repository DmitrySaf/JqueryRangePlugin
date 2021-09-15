import { Model } from '../app/model/model';
import { Presenter } from '../app/presenter/presenter';
import { View } from '../app/view/view';
import '../app/options';

(function ($) {
    $.fn.slider = function (options: IOptions) {
        let settings = $.extend({
            min: 0,
            max: 10000,
            double: false
        }, options)
        let view = new View(this, settings);
        let model = new Model();
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