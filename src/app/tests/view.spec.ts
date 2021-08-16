import { SetMin } from '../view';

describe('minRange', () => {
    it('change min range to 100', () => {
        const set : SetMin = new SetMin();
        const input : HTMLElement = set.container;
        expect(input.classList).not.toBe('wrap');
    });
});
