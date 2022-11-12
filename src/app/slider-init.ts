import Model from './mvp/model/model';
import Presenter from './mvp/presenter/presenter';
import View from './mvp/view/view';
import { IDefinedOptions, defaultOptions, IUndefinedOptions } from './options';

$.fn.slider = function Slider(options: IUndefinedOptions) {
  const settings: IDefinedOptions = $.extend({ ...defaultOptions }, options);
  const model = new Model(settings);
  const view = new View(this[0], model.options);
  const presenter = new Presenter(view, model);

  this.data('slider', presenter);
  return presenter;
};
