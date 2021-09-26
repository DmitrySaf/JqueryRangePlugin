import { IOptions } from '../options';
import { Bar } from './bar';
import { Dot } from './dot';
import { Slider } from './slider';
import { Minmax} from './minmax';
import { Event } from '../event';

interface MouseEvent {
    pageX: number,
    pageY: number,
    currentTarget: HTMLElement,
    preventDefault: any
}

class View {
    public options: IOptions;

    private slider: Slider;

    private dot: Dot;

    private bar: Bar;

    private minmax: Minmax;

    public updateViewOptionsObserver: Event;

    public currentOptions: IOptions;

    private dots: JQuery<HTMLElement>;

    private input: JQuery<HTMLElement>;

    get state() : {from: number, to: number} { return { from: this.currentOptions.from, to: this.currentOptions.to }; }

    constructor(input: JQuery<HTMLElement>, options: IOptions) {
        this.input = input;
        this.options = options;
        this.currentOptions = { ...options };
        this.updateViewOptionsObserver = new Event();
        this.slider = new Slider();
        this.bar = new Bar();
        this.dot = new Dot();
        this.minmax = new Minmax();
        this.init();
    }

    public updateViewOptions = (modelOptions : IOptions) => {
        this.options = { ...modelOptions };
    }

    private init = () => {
        this.createSlider();
        this.render();
        this.addEventListeners();
    }

    private createSlider = () => {        
        this.input.addClass('hidden');
        this.slider.elem.append(this.bar.elem, this.minmax.elemMin, this.minmax.elemMax, this.dot.elemFirst, this.dot.elemSecond);
        this.input.before(this.slider.elem);
        this.dots = this.slider.elem.find('span').parent();
    }

    private render = () => {
        const dotSecond = this.dot.elemSecond,
              dotFirst = this.dot.elemFirst,
              dotFirstValue = this.dot.valueFirst,
              minElem = this.minmax.elemMin,
              maxElem = this.minmax.elemMax,
              options = this.options;

        if (options.vertical) {
            this.addVerticalClasses();
            this.setFillerStyles();
        }

        if (options.double) {
            dotFirstValue.addClass('shown');
            dotFirst.addClass('shown');
            this.moveAt(dotFirst[0], 'from');
        }

        this.setFillerStyles();
        minElem.text(options.min);
        maxElem.text(options.max);

        this.moveAt(dotSecond[0], 'to');
        this.comfortableValueDisplay();
    }

    private addEventListeners = () => {
        this.dots.on('mousedown', this.mouseDownHandler);
    }

    private mouseDownHandler = (event: MouseEvent) => {
        event.preventDefault();

        const mousemove = (e: { pageX: number, pageY: number }) => {
            const coords = {
                x: e.pageX - this.slider.elem.position().left,
                y: e.pageY - this.slider.elem.position().top,
            }
            if (event.currentTarget.classList.contains('js-slider__dot_wrapper_first')) {
                this.updateCurrentOptions(this.calcValue(coords), 'from')
                this.moveAt(event.currentTarget, 'from');
            } else {
                this.updateCurrentOptions(this.calcValue(coords), 'to')
                this.moveAt(event.currentTarget, 'to');
            }
            this.comfortableValueDisplay();
            this.setFillerStyles();
        }

        const mouseup = () => {
            $(document).off('mousemove', mousemove );
        }
        $(document).on('mousemove', mousemove );
        $(document).on('mouseup', mouseup);
    }

    private updateCurrentOptions = (value: number, name: 'from' | 'to') => {
        this.currentOptions[name] = value;
        this.updateViewOptionsObserver.notify();
    }

    private moveAt = (eTarget: HTMLElement, optionName: 'from' | 'to') => {
        if ( this.options.vertical ) {
            eTarget.style.top = `${this.calcTop(this.options[optionName])}px`;
        } else {
            eTarget.style.left = `${this.calcLeft(this.options[optionName])}px`;
        }
    }

    private comfortableValueDisplay = () => {
        this.toggleClassHidden(this.calcLeft(this.options.max) - this.calcLeft(this.options.to), 'elemMax');
        this.toggleClassHidden(this.calcLeft(this.options.to), 'elemMin');
        
        this.dot.valueSecond.text(this.options.to);
        this.dot.valueFirst.text(this.options.from);

        if (this.options.double) {
            if ((this.calcLeft(this.options.to) - this.calcLeft(this.options.from)) < 40) {
                this.dot.valueFirst.addClass('hidden')
                this.dot.valueSecond
                    .text(`${this.options.from} - ${this.options.to}`)
                    .css('left', `calc(50% - ${(this.calcLeft(this.options.to) - this.calcLeft(this.options.from)) / 2}px)`);
            } else {
                this.dot.valueFirst.removeClass('hidden');
                this.dot.valueSecond.css('left', '50%');
            }
            this.toggleClassHidden(this.calcLeft(this.options.from), 'elemMin');
        }
    }

    private addVerticalClasses = () => {
        this.slider.elem.addClass('slider_vertical');
        this.bar.elem.addClass('slider__bar_vertical');
        this.minmax.elemMin.addClass('slider__min_vertical');

    }

    private toggleClassHidden = (coords: number, element: 'elemMin' | 'elemMax') => {
        //const isVertical = this.options.vertical;
/*         if (coords < 50) {
            isVertical ? this.calcTop()
        } */

        (coords < 50) 
            ? this.minmax[element].addClass('hidden') 
            : this.minmax[element].removeClass('hidden');
    }

    private setFillerStyles = () => {
        const dotWidth = this.dot.elemSecond.outerWidth() as number;
        const isVertical = this.options.vertical;
        this.bar.filler.css({
            top: `${isVertical ? this.calcTop(this.options.from) + (dotWidth / 2) : 0}px`,
            left: `${isVertical ? 0 : this.calcLeft(this.options.from) + (dotWidth / 2)}px`,
            height: `${isVertical ? this.calcTop(this.options.to) - this.calcTop(this.options.from) : 20}px`,
            width: `${isVertical ? 20 : this.calcLeft(this.options.to) - this.calcLeft(this.options.from)}`
        })
    }

    private calcValue(cursorCoords : {x: number, y: number}): number {
        let coordsToSliderRatio: number = this.options.vertical 
            ? cursorCoords.y / (this.slider.elem.outerHeight() as number)
            : cursorCoords.x / (this.slider.elem.outerWidth() as number);
        return Math.round(
            ( coordsToSliderRatio * (this.options.max - this.options.min) + this.options.min ) / this.options.step
        ) * this.options.step;
    }

    private calcLeft(value: number): number {
        const sliderWidth = this.slider.elem.outerWidth() as number,
              dotWidth = this.dot.elemSecond.outerWidth() as number;
        return ((value - this.options.min) / (this.options.max - this.options.min)) * sliderWidth - (dotWidth / 2);
    }

    private calcTop(value: number): number {
        const sliderHeight = this.slider.elem.outerHeight() as number,
              dotWidth = this.dot.elemSecond.outerWidth() as number;
        return ((value - this.options.min) / (this.options.max - this.options.min)) * sliderHeight - (dotWidth / 2);
    }

}

export { View };
