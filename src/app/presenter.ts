import { View } from './view';
import { Model } from './model';
//import { EventHandler } from './event';

class Presenter {
    view: View;

    model: Model;

    constructor(view: View, model: Model) {
        this.view = view;
        this.model = model;
        this.init();
    }

    init = () => {
        this.view.mouseMoveHandler((event) => {
            this.view.onSliderMove(event);
            this.moveAt();
        })
    }

    moveAt = () => {
        this.model.changeDotValue(this.view.getDotCoords().leftTo);
    }
}

export { Presenter };


