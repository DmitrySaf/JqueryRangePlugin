import Model from './app/mvp/model/model';
import Presenter from './app/mvp/presenter/presenter';
import View from './app/mvp/view/view';
import { IDefinedOptions, defaultOptions, IUndefinedOptions } from './app/options';
import './app/styles/slider.sass';

$.fn.slider = function Slider(options: IUndefinedOptions) {
  const settings: IDefinedOptions = $.extend({ ...defaultOptions }, options);
  const model = new Model(settings);
  const view = new View(this, model.options);
  const presenter = new Presenter(view, model);

  $(this).data('slider', presenter);
  return presenter;
};
