import { Model } from './app/mvp/model/Model';
import { Presenter } from './app/mvp/presenter/Presenter';
import { View } from './app/mvp/view/View';
import { IUndefinedOptions } from './app/options';

interface Ex {
  view: View,
  model: Model,
}

declare global {
  interface JQuery {
    slider(options?: IUndefinedOptions): Presenter
  }
}
