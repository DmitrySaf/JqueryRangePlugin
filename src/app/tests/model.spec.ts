import { Slider } from '../model';

describe('Slider', () => {
    it('Should return slider min number', () => {
        const slider : Slider = new Slider(0, 100);
        const sliderMin : number = slider.min;
        expect(sliderMin).toBe(0);
    });
});
