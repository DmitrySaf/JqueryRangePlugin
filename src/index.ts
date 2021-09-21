import { Model } from './app/model/model';
import { Presenter } from './app/presenter/presenter';
import { View } from './app/view/view';
import './app/options';

(function ($) {
    $.fn.slider = function (options: IOptions) {
        let settings = $.extend({
            min: 0,
            max: 10000,
            from: 3000,
            to: 7000,
            step: 1,
            double: false,
            vertical: false
        }, options)
        let model = new Model(settings);
        let view = new View(this, model.clearedOptions);
        let presenter = new Presenter(view, model)
        return presenter;
    };
}(jQuery));

$('#range').slider({
    min: 20000,
    to: '9000',
    vertical: 'asdasd',
    step: 1
});

$('#test').slider({
    min: -2000,
    step: 200,
    vertical: false,
    double: true
});


