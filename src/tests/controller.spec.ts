import { Controller } from '../app/controller';
import { View } from '../app/View';

const controller = new Controller(new View($('.container')));

beforeAll(() => {
    jest.spyOn(controller, 'mouseMove');
});

describe('changeMin', () => {
    it('change min to 100', () => {
        controller.mouseMove();
        expect(controller.mouseMove).toHaveBeenCalled();
    });
});
