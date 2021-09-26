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

    init = () => {
/*         this.view.mouseDownHandler((event) => {
            this.view.mouseMove(event);
            this.changeDotValue();
            this.view.mouseMoveHandler((event) => {
                this.changeDotValue();
                this.view.documentMouseMoveHandler(() => {
                    this.changeDotValue();
                })
            });
        }); */
        //console.log(this.view.state)
        this.model.updateModelOptionsObserver.attach(() => {
            this.updateViewOptions(this.model.options);
        });
        this.view.updateViewOptionsObserver.attach(() => {
            this.updateModelOptions(this.view.currentOptions);
        })

        
    }

    updateModelOptions = (viewOptions : IOptions) => {
        this.model.updateModelOptions(viewOptions);
        this.model.getState(this.view.state);
    }

    updateViewOptions = (modelOptions : IOptions) => {
        this.view.updateViewOptions(modelOptions);
    }
}

export { Presenter };


