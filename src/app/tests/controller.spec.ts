import {ChangeMin} from '../controller';
import {expect} from 'chai';
import 'mocha';

describe('changeMin', () => {
    it('change min to 100', () => {
        let minClass : ChangeMin = new ChangeMin(100);
        let minChange : number = minClass.change();

        expect(minChange).to.deep.equal(100);
    })
})