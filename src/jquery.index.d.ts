import { Model } from './app/mvp/model/model';
import { Presenter } from './app/mvp/presenter/presenter';
import { View } from './app/mvp/view/view';
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
