import { Observable } from './observer';

class Model {

    changeDotValueObserver: Observable;

    dotFirstValue: number;

    dotSecondValue: number;

    constructor() {
        this.changeDotValueObserver = new Observable();
    }

    changeDotValue(dotSecondValue: number, dotFirstValue : number = 0) {
        this.dotFirstValue = dotFirstValue;
        this.dotSecondValue = dotSecondValue;
        this.changeDotValueObserver.notify();
    }


}

export { Model };
