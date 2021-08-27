import { Observable } from './observer';

class Model {

    changeDotValueObserver: Observable;

    dotFromValue: number;

    constructor() {
        this.changeDotValueObserver = new Observable();
    }

    changeDotValue(dotValue : number) {
        this.dotFromValue = dotValue;
        this.changeDotValueObserver.notify();
    }


}

export { Model };
