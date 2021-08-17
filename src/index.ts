import './app/model';
import { Controller } from './app/controller';
import { View } from './app/view';

(function ($) {
    $.fn.slider = function (container: JQuery<HTMLElement>) {
        const view = new View(container);
        return new Controller(view);
    };
}(jQuery));

$('.container').slider($('.container'));
