import Model from './mvp/Model/Model';
import Presenter from './mvp/Presenter/Presenter';
import View from './mvp/View/View';
import { IDefinedOptions, defaultOptions, IUndefinedOptions } from './options';

$.fn.slider = function Slider(options: IUndefinedOptions) {
  const settings: IDefinedOptions = $.extend({ ...defaultOptions }, options);
  const model = new Model(settings);
  const view = new View(this[0], model.options, model.position);
  const presenter = new Presenter(view, model);

  this.data('slider', presenter);
  return presenter;
};
