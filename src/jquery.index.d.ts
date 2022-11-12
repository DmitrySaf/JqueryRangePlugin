import { Model } from './app/mvp/Model/Model';
import { Presenter } from './app/mvp/Presenter/Presenter';
import { View } from './app/mvp/View/View';
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
