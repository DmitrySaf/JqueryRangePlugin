import { IOptions } from '../options';
import { Bar } from './bar';
import { Dot } from './dot';
import { Slider } from './slider';
import { Minmax } from './minmax';
import { Event } from '../event';

interface MouseEvent {
    pageX: number,
    pageY: number,
    currentTarget: HTMLElement,
    preventDefault: () => void
}

class View {
    public checkedOptions: IOptions;

    public updateViewOptionsObserver: Event;

    public currentOptions: IOptions;

    public modelStatic: { from: number, to: number };

    private slider: Slider;

    private dot: Dot;

    private bar: Bar;

    private minmax: Minmax;

    private dots: JQuery<HTMLElement>;

    private input: JQuery<HTMLElement>;

    constructor(input: JQuery<HTMLElement>, options: IOptions) {
        this.input = input;
        this.checkedOptions = options;
        this.currentOptions = { ...options };
        this.updateViewOptionsObserver = new Event();
        this.slider = new Slider();
        this.bar = new Bar();
        this.dot = new Dot();
        this.minmax = new Minmax();
        this.init();
    }

    public updateViewOptions = (modelOptions: IOptions, modelStatic: { from: number, to: number }): void => {
        this.checkedOptions = { ...modelOptions };
        this.modelStatic = { ...modelStatic };
    };

    private init = () => {
        this.createSlider();
        this.render();
        this.addEventListeners();
    };

    private createSlider = () => {
        this.input.addClass('hidden');
        this.slider.elem.append(
            this.bar.elem,
            this.minmax.elemMin,
            this.minmax.elemMax,
            this.dot.elemFirst,
            this.dot.elemSecond,
        );
        this.input.before(this.slider.elem);
        this.dots = this.slider.elem.find('span').parent();
    };

    private render = () => {
        if (this.checkedOptions.vertical) {
            this.addVerticalClasses();
            this.setFillerStyles();
        }

        if (this.checkedOptions.double) {
            this.dot.elemFirst.addClass('shown');
            this.moveAtFrom(this.dot.elemFirst[0]);
        }

        this.setFillerStyles();
        this.minmax.elemMax.text(this.checkedOptions.max);
        this.minmax.elemMin.text(this.checkedOptions.min);

        this.moveAtTo(this.dot.elemSecond[0]);
        this.comfortableValueDisplay();
    };

    private addEventListeners = () => {
        this.dots.on('mousedown', this.mouseDownHandler);
    };

    private mouseUpHandler = () => {
        this.modelStatic.from = this.currentOptions.from;
        this.modelStatic.to = this.currentOptions.to;
    }

    private getValueOfDot = (event: { pageX: number, pageY: number }): number => {
        const coords = {
            x: event.pageX - this.slider.elem.position().left,
            y: event.pageY - this.slider.elem.position().top,
        };
        return this.calcValue(coords);
    }

    private mouseDownHandler = (event: MouseEvent) => {
        event.preventDefault();

        const mousemove = (e: { pageX: number, pageY: number }) => {
            if (event.currentTarget.classList.contains('js-slider__dot_wrapper_first')) {
                this.updateCurrentOptions(this.getValueOfDot(e), 'from');
                this.moveAtFrom(event.currentTarget);
            } else {
                this.updateCurrentOptions(this.getValueOfDot(e), 'to');
                this.moveAtTo(event.currentTarget);
            }
            this.comfortableValueDisplay();
            this.setFillerStyles();
        };
        
        const mouseup = () => {
            $(document).off('mousemove', mousemove);
            $(document).off('mouseup', mouseup);
            this.mouseUpHandler();
        };
        $(document).on('mousemove', mousemove);
        $(document).on('mouseup', mouseup);
    };

    private updateCurrentOptions = (value: number, name: 'from' | 'to') => {
        this.currentOptions[name] = value;
        this.updateViewOptionsObserver.notify();
    };

    private moveAtTo = (eTarget: HTMLElement) => {
        const target = eTarget;
        if (this.checkedOptions.vertical) {
            target.style.top = `${this.calcTop(this.checkedOptions.to)}px`;
        } else {
            target.style.left = `${this.calcLeft(this.checkedOptions.to)}px`;
        }
    };

    private moveAtFrom = (eTarget: HTMLElement) => {
        const target = eTarget;
        if (this.checkedOptions.vertical) {
            target.style.top = `${this.calcTop(this.checkedOptions.from)}px`;
        } else {
            target.style.left = `${this.calcLeft(this.checkedOptions.from)}px`;
        }
    };

    private comfortableValueDisplay = () => {
        if (this.checkedOptions.vertical) {
            this.toggleMinmaxHidden(this.calcTop(this.checkedOptions.max) - this.calcTop(this.checkedOptions.to), 'elemMax');
            this.toggleMinmaxHidden(this.calcTop(this.checkedOptions.to), 'elemMin');
        } else {
            this.toggleMinmaxHidden(this.calcLeft(this.checkedOptions.max) - this.calcLeft(this.checkedOptions.to), 'elemMax');
            this.toggleMinmaxHidden(this.calcLeft(this.checkedOptions.to), 'elemMin');
        }

        this.dot.valueSecond.text(this.checkedOptions.to);
        this.dot.valueFirst.text(this.checkedOptions.from);

        if (this.checkedOptions.double) {
            if (this.checkedOptions.vertical) {
                if ((this.calcTop(this.checkedOptions.to) - this.calcTop(this.checkedOptions.from)) < 40) {
                    this.dot.valueFirst
                        .addClass('hidden')
                        .removeClass('shown');
                    this.dot.valueSecond.text(`${this.checkedOptions.from} - ${this.checkedOptions.to}`);
                } else {
                    this.dot.valueFirst.removeClass('hidden');
                }
                this.toggleMinmaxHidden(this.calcTop(this.checkedOptions.from), 'elemMin');
            } else {
                if ((this.calcLeft(this.checkedOptions.to) - this.calcLeft(this.checkedOptions.from)) < 40) {
                    this.dot.valueFirst
                        .addClass('hidden')
                        .removeClass('shown');
                    this.dot.valueSecond
                        .text(`${this.checkedOptions.from} - ${this.checkedOptions.to}`)
                        .css('left', `calc(50% - ${(this.calcLeft(this.checkedOptions.to) - this.calcLeft(this.checkedOptions.from)) / 2}px)`);
                } else {
                    this.dot.valueFirst.removeClass('hidden');
                    this.dot.valueSecond.css('left', '50%');
                }
                this.toggleMinmaxHidden(this.calcLeft(this.checkedOptions.from), 'elemMin');
            }
        }
    };

    private addVerticalClasses = () => {
        this.slider.elem.addClass('slider_vertical');
        this.bar.elem.addClass('slider__bar_vertical');
        this.minmax.elemMin.addClass('slider__min_vertical');
        this.minmax.elemMax.addClass('slider__max_vertical');
    };

    private toggleMinmaxHidden = (coords: number, element: 'elemMin' | 'elemMax') => ((coords < 50) ? this.minmax[element].addClass('hidden') : this.minmax[element].removeClass('hidden'));

    private setFillerStyles = () => {
        const dotWidth = this.dot.elemSecond.outerWidth() as number;
        const isVertical = this.checkedOptions.vertical;
        this.bar.filler.css({
            top: `${isVertical ? this.calcTop(this.checkedOptions.from) + (dotWidth / 2) : 0}px`,
            left: `${isVertical ? 0 : this.calcLeft(this.checkedOptions.from) + (dotWidth / 2)}px`,
            height: `${isVertical ? this.calcTop(this.checkedOptions.to) - this.calcTop(this.checkedOptions.from) : 20}px`,
            width: `${isVertical ? 20 : this.calcLeft(this.checkedOptions.to) - this.calcLeft(this.checkedOptions.from)}`,
        });
    };

    private calcValue(cursorCoords : { x: number, y: number }): number {
        const coordsToSliderRatio: number = this.checkedOptions.vertical
            ? cursorCoords.y / (this.slider.elem.outerHeight() as number)
            : cursorCoords.x / (this.slider.elem.outerWidth() as number);
        return Math.round(
            (coordsToSliderRatio * (this.checkedOptions.max - this.checkedOptions.min) + this.checkedOptions.min)
            / this.checkedOptions.step,
        ) * this.checkedOptions.step;
    }

    private calcLeft(value: number): number {
        const sliderWidth = this.slider.elem.outerWidth() as number;
        const dotWidth = this.dot.elemSecond.outerWidth() as number;
        return ((value - this.checkedOptions.min) / (this.checkedOptions.max - this.checkedOptions.min)) * sliderWidth
        - (dotWidth / 2);
    }

    private calcTop(value: number): number {
        const sliderHeight = this.slider.elem.outerHeight() as number;
        const dotWidth = this.dot.elemSecond.outerWidth() as number;
        return ((value - this.checkedOptions.min) / (this.checkedOptions.max - this.checkedOptions.min)) * sliderHeight
        - (dotWidth / 2);
    }
}

export { View };
