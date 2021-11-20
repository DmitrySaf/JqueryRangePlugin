import { sliderModel } from './index.spec';

beforeAll(() => {
    jest.spyOn(sliderModel, 'updateModelOptions');
    jest.spyOn(sliderModel.updateModelOptionsObserver, 'notify');
});

describe('Model', () => {
    it('checks if the function calls observer notify function', () => {
        //sliderModel.updateModelOptions(options);
        expect(sliderModel.updateModelOptionsObserver.observers).toHaveBeenCalled();
    });
});
