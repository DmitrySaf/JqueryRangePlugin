import View from '../View/View';
import Model from '../Model/Model';
import { IDefinedOptions, Coords } from '../../options';

class Presenter {
  public view: View;

  public model: Model;

  constructor(view: View, model: Model) {
    this.view = view;
    this.model = model;
    this.init();
  }

  public init = (): void => {
    this.model.updateModelOptionsObserver.attach(() => {
      this.updateViewOptions(this.model.options, this.model.static, this.model.position);
    });
    this.view.updateViewOptionsObserver.attach(() => {
      this.updateModelOptions(this.view.currentOptions, this.view.modelStatic);
    });
  };

  public updateModelOptions = (viewOptions: IDefinedOptions, modelStatic: Coords): void => {
    this.model.updateModelOptions(viewOptions, modelStatic);
  };

  public updateViewOptions = (modelOptions: IDefinedOptions, modelStatic: Coords, position: Coords): void => {
    this.view.updateViewOptions(modelOptions, modelStatic, position);
  };
}

export default Presenter;
