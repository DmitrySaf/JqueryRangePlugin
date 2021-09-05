import { View } from './view';
import { Model } from './model';

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
            this.view.onSliderMove(event);
            this.changeDotValue();
            this.view.mouseMoveHandler((event) => {
                this.changeDotValue();
            });
        });
        this.model.changeDotValueObserver.attach(() => {
            //console.log(this.model.dotSecondValue);
        });

        
    }

    changeDotValue = () => {
        this.model.changeDotValue(this.view.getDotCoords().secondDot);
    }
}

export { Presenter };


