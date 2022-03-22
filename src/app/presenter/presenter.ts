import { View } from '../view/view';
import { Model } from '../model/model';
import { IOptions } from '../options';

class Presenter {
    private view: View;

    private model: Model;

    constructor(view: View, model: Model) {
        this.view = view;
        this.model = model;
        this.init();
    }

    private init = (): void => {
        this.model.updateModelOptionsObserver.attach(() => {
            this.updateViewOptions(this.model.options, this.model.static);
        });
        this.view.updateViewOptionsObserver.attach(() => {
            this.updateModelOptions(this.view.currentOptions, this.view.modelStatic);
        });
    };

    private updateModelOptions = (viewOptions: IOptions, modelStatic: { from: number, to: number }): void => {
        this.model.updateModelOptions(viewOptions, modelStatic);
    };

    private updateViewOptions = (modelOptions: IOptions, modelStatic: { from: number, to: number }): void => {
        this.view.updateViewOptions(modelOptions, modelStatic);
    };
}

export { Presenter };
