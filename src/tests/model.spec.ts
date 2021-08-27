//import { Model } from '../app/model';
import { Observable } from '../app/observer'

describe('Slider', () => {
    it('Observers', () => {
        const observer = new Observable();
        const fn = () => {};
        observer.attach(fn);
        expect(observer.observers.length).toBe(1)
    });
});
