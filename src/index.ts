import { Model } from './app/model/model';
import { Presenter } from './app/presenter/presenter';
import { View } from './app/view/view';
import { IOptions } from './app/options';
import { Panel } from './panel/panel';

(function Declare($: JQueryStatic) {
    $.fn.slider = function Slider(options: IOptions) {
        const settings = $.extend({
            min: 0,
            max: 10000,
            from: 0,
            to: 5000,
            step: 1,
            double: false,
            vertical: false
        }, options);
        const model = new Model(settings);
        const view = new View(this, model.options);
        const presenter = new Presenter(view, model);
        return presenter;
    };
}(jQuery));

$('#range').slider({
    min: 0,
    max: 4000,
    vertical: true,
    double: true,
    from: 300,
    to: 700,
    step: 1,
    scale: true,
    scaleFrequency: 9
});

const panel = new Panel();

$('#range').before(panel.$elem);

/* $('#test').slider({
    max: 10000,
    min: 2000,
    from: 3000,
    to: 5000,
    step: 200,
    vertical: false,
    double: false
}); */
