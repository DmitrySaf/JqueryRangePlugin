/* import { Presenter } from '../app/presenter';
import { View } from '../app/View';
import { Model } from '../app/model';

const view = new View($('#range'), {min: 100, double: true})
const controller = new Presenter(view, new Model());

beforeAll(() => {
    jest.spyOn(controller, 'mouseMove');

});

describe('Controller', () => {
    it('methods called', () => {
        controller.mouseMove();
        expect(controller.mouseMove).toHaveBeenCalled();
    });
}); */
