import { View } from '../view/view';
import { Model } from '../model/model';
import { IOptions } from '../options';

class Presenter {
    view: View;

    model: Model;

    constructor(view: View, model: Model) {
        this.view = view;
        this.model = model;
        this.init();
    }

    init = (): void => {
        this.model.updateModelOptionsObserver.attach(() => {
            this.updateViewOptions(this.model.options, this.model.state);
        });
        this.view.updateViewOptionsObserver.attach(() => {
            this.updateModelOptions(this.view.currentOptions, this.view.modelState);
        });
    };

    updateModelOptions = (viewOptions: IOptions, modelState: { from: number, to: number }): void => {
        this.model.updateModelOptions(viewOptions, modelState);
    };

    updateViewOptions = (modelOptions: IOptions, modelState: { from: number, to: number }): void => {
        this.view.updateViewOptions(modelOptions, modelState);
    };
}

export { Presenter };
