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
            this.updateViewOptions(this.model.options);
        });
        this.view.updateViewOptionsObserver.attach(() => {
            this.updateModelOptions(this.view.currentOptions);
        });
    };

    updateModelOptions = (viewOptions : IOptions): void => {
        this.model.updateModelOptions(viewOptions);
    };

    updateViewOptions = (modelOptions : IOptions): void => {
        this.view.updateViewOptions(modelOptions);
    };
}

export { Presenter };
