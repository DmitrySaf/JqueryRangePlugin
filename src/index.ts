import { Model } from './app/model';
import { Presenter } from './app/presenter';
import { View } from './app/view';
import './app/options';

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

$('#range').slider();

$('#test').slider({
    double: true
});


