import { sliderModel } from './index.spec'

beforeAll(() => {
    jest.spyOn(sliderModel, 'changeDotValue');
    jest.spyOn(sliderModel.changeDotValueObserver, 'notify')
})

describe('Model', () => {
    it('checks if the function calls observer notify function', () => {
        sliderModel.changeDotValue();
        expect(sliderModel.changeDotValueObserver.notify).toHaveBeenCalled();
    });
});
