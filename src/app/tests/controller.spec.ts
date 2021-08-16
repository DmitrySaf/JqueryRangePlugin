import { ChangeMin } from '../controller';

describe('changeMin', () => {
    it('change min to 100', () => {
        const minClass : ChangeMin = new ChangeMin(100);
        const minChange : number = minClass.change();
        expect(minChange).toBe(100);
    });
});
