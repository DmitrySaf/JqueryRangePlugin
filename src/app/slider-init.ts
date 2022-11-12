import Model from './mvp/model/Model';
import Presenter from './mvp/presenter/Presenter';
import View from './mvp/view/View';
import { IDefinedOptions, defaultOptions, IUndefinedOptions } from './options';

$.fn.slider = function Slider(options: IUndefinedOptions) {
  const settings: IDefinedOptions = $.extend({ ...defaultOptions }, options);
  const model = new Model(settings);
  const view = new View(this[0], model.options);
  const presenter = new Presenter(view, model);

  this.data('slider', presenter);
  return presenter;
};
