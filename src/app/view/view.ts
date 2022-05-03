import { IOptions, Coords } from '../options';
import { Bar } from './bar';
import { Dot } from './dot';
import { Slider } from './slider';
import { Minmax } from './minmax';
import { Scale } from './scale';
import { Event } from '../event';

interface MouseEvent {
    pageX: number,
    pageY: number,
    currentTarget: HTMLElement,
    preventDefault: () => void
}

class View {
    public updateViewOptionsObserver: Event;

    public currentOptions: IOptions;

    public modelStatic: Coords;

    public checkedOptions: IOptions;

    private slider: Slider;

    private dot: Dot;

    private bar: Bar;

    private minmax: Minmax;

    private dots: JQuery<HTMLElement>;

    private input: JQuery<HTMLElement>;

    private scale: Scale;

    constructor(input: JQuery<HTMLElement>, options: IOptions) {
        this.input = input;
        this.checkedOptions = options;
        this.currentOptions = { ...options };
        this.updateViewOptionsObserver = new Event();
        this.slider = new Slider();
        this.bar = new Bar();
        this.dot = new Dot();
        this.minmax = new Minmax();
        this.scale = new Scale();
        this.modelStatic = { from: this.checkedOptions.from, to: this.checkedOptions.to };
        this.init();
    }

    public updateViewOptions = (
        modelOptions: IOptions,
        modelStatic: Coords
    ): void => {
        this.checkedOptions = { ...modelOptions };
        this.currentOptions = { ...modelOptions };
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
            this.minmax.elemMax,
            this.minmax.elemMin,
            this.scale.container,
            this.dot.elemFirst,
            this.dot.elemSecond
        );
        this.input.before(this.slider.elem);
        this.dots = this.slider.elem.find('span').parent();
    };

    private render = () => {
        const { 
            min,
            max,
            vertical,
            double
        } = this.checkedOptions
        if (vertical) this.addVerticalClasses();

        if (double) {
            this.dot.elemFirst.addClass('shown');
            this.moveAt(this.dot.elemFirst[0], 'from');
        }

        if (this.checkedOptions.scale) this.comfortableScaleDisplay();

        this.setFillerStyles();
        this.minmax.elemMax.text(max);
        this.minmax.elemMin.text(min);

        this.moveAt(this.dot.elemSecond[0], 'to');
        this.comfortableValueDisplay();
    };

    private addEventListeners = () => {
        this.dots.on('mousedown', this.onMouseDown);
        this.bar.elem.on('click', this.onMouseClick);
        this.scale.container.children().on('click', this.onScaleClick);
    };

    private onMouseDown = (event: MouseEvent) => {
        event.preventDefault();

        const mousemove = (e: { pageX: number, pageY: number }) => {
            if (event.currentTarget.classList.contains('js-slider__dot_wrapper_first')) {
                this.updateCurrentOptions(this.getValueOfDot(e), 'from');
                this.moveAt(this.dots[0], 'from');
            } else {
                this.updateCurrentOptions(this.getValueOfDot(e), 'to');
                this.moveAt(this.dots[1], 'to');
            }
            this.comfortableValueDisplay();
            this.setFillerStyles();
            this.onMouseUp();
        };
        const mouseup = () => {
            $(document).off('mousemove', mousemove);
            $(document).off('mouseup', mouseup);
            this.onMouseUp();
        };
        $(document).on('mousemove', mousemove);
        $(document).on('mouseup', mouseup);
    };

    private onMouseClick = (event: MouseEvent) => {
        if (this.checkedOptions.double) {
            if (Math.abs(this.getValueOfDot(event) - this.currentOptions.from)
            <= Math.abs(this.getValueOfDot(event) - this.currentOptions.to)) {
                this.updateCurrentOptions(this.getValueOfDot(event), 'from');
                this.moveAt(this.dots[0], 'from');
            } else {
                this.updateCurrentOptions(this.getValueOfDot(event), 'to');
                this.moveAt(this.dots[1], 'to');
            }
        } else {
            this.updateCurrentOptions(this.getValueOfDot(event), 'to');
            this.moveAt(this.dots[1], 'to');
        }
        this.comfortableValueDisplay();
        this.setFillerStyles();
    };

    private onMouseUp = () => {
        this.modelStatic.from = this.checkedOptions.from;
        this.modelStatic.to = this.checkedOptions.to;
    };

    private onScaleClick = (event: MouseEvent) => {
/*         const target = event.currentTarget;
        const width = target.offsetWidth / 2;
        const height = target.offsetHeight / 2; */
        const coords = { x: event.currentTarget.offsetLeft + event.currentTarget.offsetWidth / 2, y: event.currentTarget.offsetTop}
        const val = this.calcValue(coords);

        this.updateCurrentOptions(val, "to")
        this.moveAt(this.dots[1], "to");
        this.comfortableValueDisplay();
        this.setFillerStyles();
    };

    private getValueOfDot = (event: { pageX: number, pageY: number }): number => {
        const coords = {
            x: event.pageX - this.slider.elem.position().left,
            y: event.pageY - this.slider.elem.position().top
        };
        return this.calcValue(coords);
    };

    private updateCurrentOptions = (value: number, optionName: 'from' | 'to') => {
        this.currentOptions[optionName] = value;
        this.updateViewOptionsObserver.notify();
    };

    private moveAt = (target: HTMLElement, optionName: 'from' | 'to') => {
        if (this.checkedOptions.vertical) {
            target.style.top = `${this.calcPosition(this.checkedOptions[optionName])}px`;
        } else {
            target.style.left = `${this.calcPosition(this.checkedOptions[optionName])}px`;
        }
    };

    private comfortableValueDisplay = () => {
        const { 
            max,
            from, 
            to 
        } = this.checkedOptions;
        const isVertical = this.checkedOptions.vertical;
        const posFrom = this.calcPosition(from);
        const posTo = this.calcPosition(to);
        const posMax = this.calcPosition(max);

        this.toggleMinMaxHidden(posMax - posTo, 'elemMax');
        this.toggleMinMaxHidden(posTo, 'elemMin');

        this.dot.valueSecond.text(to);
        this.dot.valueFirst.text(from);

        if (this.checkedOptions.double) {
            if ((posTo - posFrom) < 40) {
                this.dot.valueFirst
                    .addClass('hidden')
                    .removeClass('shown');
                this.dot.valueSecond.text(`${from} - ${to}`);
                if (!isVertical) {
                    this.dot.valueSecond.css({ left: `calc(50% - ${(posTo - posFrom) / 2}px)` });
                }
            } else {
                this.dot.valueFirst.removeClass('hidden');
                if (!isVertical) this.dot.valueSecond.css('left', '50%');
            }
            this.toggleMinMaxHidden(posFrom, 'elemMin');
        }
    };

    private setFillerStyles = () => {
        const dotWidth = this.dot.elemSecond.outerWidth() as number;
        const isVertical = this.checkedOptions.vertical;
        const posFrom = this.calcPosition(this.checkedOptions.from);
        const posTo = this.calcPosition(this.checkedOptions.to);

        this.bar.filler.css({
            top: `${
                isVertical ? posFrom + (dotWidth / 2) : 0
            }px`,
            left: `${
                isVertical ? 0 : posFrom + (dotWidth / 2)
            }px`,
            height: `${
                isVertical ? (posTo - posFrom) : 20
            }px`,
            width: `${
                isVertical ? 20 : (posTo - posFrom)
            }px`
        });
    };

    private comfortableScaleDisplay = () => {
        const frequency = this.checkedOptions.scaleFrequency;
        const {
            min,
            max
        } = this.checkedOptions;

        this.scale.container.append(this.scale.createElemsArray(frequency, min, max));

        const scaleElemsArray = this.scale.container.find('div');

        if (this.checkedOptions.scaleFrequency > 1) {
            for (let i = 0; i < frequency; i++) {
                scaleElemsArray.filter(`:nth-child(${ i + 1 })`).css({
                    left: `${
                        this.calcPosition( 
                            Math.round(min + i * ((max - min) / (frequency - 1))) * this.checkedOptions.step, 
                            scaleElemsArray.filter(`:nth-child(${ i + 1 })`)
                        )
                    }px`
                });
            };
        } else {
            scaleElemsArray[0].style.left = `calc(50% - ${scaleElemsArray[0].clientWidth / 2}px)`;
        }
        console.log(this.checkedOptions.scaleFrequency)
        let sum = 0;
        for (let i = 0; i < scaleElemsArray.length; i++) {
            sum += scaleElemsArray[i].offsetWidth;
        };
        const sliderWidth = this.slider.elem.outerWidth() as number;

        if (sum > sliderWidth) {
            this.scale.removeElem(scaleElemsArray)
            this.currentOptions.scaleFrequency -= 1;
            //this.comfortableScaleDisplay();
        }
        console.log(this.checkedOptions.scaleFrequency)
    }

    private addVerticalClasses = () => {
        this.slider.elem.addClass('slider_vertical');
        this.bar.elem.addClass('slider__bar_vertical');
        this.minmax.elemMin.addClass('slider__min_vertical');
        this.minmax.elemMax.addClass('slider__max_vertical');
    };

    private toggleMinMaxHidden = (coords: number, elementName: 'elemMin' | 'elemMax') => (
        coords < 50
            ? this.minmax[elementName].addClass('hidden')
            : this.minmax[elementName].removeClass('hidden')
    );

    private calcValue = (cursorCoords : { x: number, y: number }): number => {
        const coordsToSliderRatio: number = this.checkedOptions.vertical
            ? cursorCoords.y / (this.slider.elem.outerHeight() as number)
            : cursorCoords.x / (this.slider.elem.outerWidth() as number);
        return Math.round(
            (coordsToSliderRatio
            * (this.checkedOptions.max - this.checkedOptions.min)
            + this.checkedOptions.min) / this.checkedOptions.step
        ) * this.checkedOptions.step;
    };

    private calcPosition = (value: number, target: JQuery<HTMLElement> = this.dot.elemSecond): number => {
        const sliderHeight = this.slider.elem.outerHeight() as number;
        const sliderWidth = this.slider.elem.outerWidth() as number;
        const sliderProp = this.checkedOptions.vertical ? sliderHeight : sliderWidth;
        const dotWidth = target.outerWidth() as number;
        return (
            (value - this.checkedOptions.min)
            / (this.checkedOptions.max - this.checkedOptions.min)
        ) * sliderProp - (dotWidth / 2);
    };
}

export { View };
