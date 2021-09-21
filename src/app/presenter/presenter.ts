import { View } from '../view/view';
import { Model } from '../model/model';

class Presenter {
    view: View;

    model: Model;

    constructor(view: View, model: Model) {
        this.view = view;
        this.model = model;
        this.init();
    }

    init = () => {
        this.view.mouseDownHandler((event) => {
            this.view.mouseMove(event);
            //this.changeDotValue();
            this.view.mouseMoveHandler((event) => {
                this.changeDotValue();
/*                 this.view.documentMouseMoveHandler(() => {
                    this.changeDotValue();
                }) */
            });
        });
        this.model.changeDotValueObserver.attach(() => {
            this.update();
        });

        
    }

    changeDotValue = () => {
        this.model.changeDotValue(this.view.getDotsValues().secondDot, this.view.getDotsValues().firstDot);
    }

    update = () => {
        this.view.dotFirstValue = this.model.dotFirstValue;
        this.view.dotSecondValue = this.model.dotSecondValue;
    }
}

export { Presenter };


