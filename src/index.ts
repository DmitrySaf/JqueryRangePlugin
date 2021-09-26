import { Model } from './app/model/model';
import { Presenter } from './app/presenter/presenter';
import { View } from './app/view/view';
import { IOptions } from './app/options';

(function ($) {
    $.fn.slider = function (options: IOptions) {
        const settings = $.extend({
            min: 0,
            max: 10000,
            from: 0,
            to: 5000,
            step: 1,
            double: false,
            vertical: false
        }, options)
        const model = new Model(settings);
        const view = new View(this, model.options);
        const presenter = new Presenter(view, model);
        return presenter;
    };
}(jQuery));

$('#range').slider({
    min: 2000,
    max: 11000,
    vertical: true,
    double: true,
    from: 5000,
    to: 7000,
    step: -11
});

$('#test').slider({
    min: 2000,
    from: 3000,
    to: 5000,
    step: 200,
    vertical: false,
    double: true
});


