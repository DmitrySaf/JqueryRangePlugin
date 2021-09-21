import '../options';
import { Bar } from './bar';
import { Dot } from './dot';
import { Filler } from './filler';
import { Slider } from './slider';
import { Minmax} from './minmax';

interface Event {
    pageX: number,
    pageY: number,
    currentTarget: HTMLElement,
    preventDefault: any
}

class View {
    options: IOptions;

    slider: Slider;

    filler: Filler;

    dot: Dot;

    bar: Bar;

    minmax: Minmax;
    
    dots: JQuery<HTMLElement>;

    dotFirstValue: number;

    dotSecondValue: number;

    input : JQuery<HTMLElement>;

    wrapper : JQuery<HTMLElement>;

    constructor(input: JQuery<HTMLElement>, options: IOptions) {
        this.input = input;
        this.options = options;
        this.wrapper = this.input.parent(); 
        this.slider = new Slider();
        this.bar = new Bar();
        this.dot = new Dot();
        this.filler = new Filler();
        this.minmax = new Minmax();
        this.dotFirstValue = this.options.from;
        this.dotSecondValue = this.options.to;
        this.init();
    }

    init = () => {
        this.createSlider();
        this.render();
    }

    createSlider = () => {
        this.slider.elem.append(this.bar.elem, this.filler.elem, this.minmax.elemMin, this.minmax.elemMax, this.dot.elemFirst, this.dot.elemSecond);
        this.input.before(this.slider.elem);
        
        this.dots = this.slider.elem.find('span');
    }

    render = () => {
        const dotSecond = this.dot.elemSecond,
              dotSecondValue = this.dot.valueSecond,
              dotSecondValueWidth = dotSecondValue.outerWidth() as number,
              dotFirst = this.dot.elemFirst,
              dotFirstValue = this.dot.valueFirst,
              minElem = this.minmax.elemMin,
              minElemWidth = minElem.outerWidth() as number,
              maxElem = this.minmax.elemMax,
              options = this.options,
              dotWidth = this.dot.elemSecond.outerWidth() as number;

        this.input.addClass('hidden');
        dotSecondValue.text(this.checkForValuesOverride(this.options.to));
        dotSecond.css('left', `${this.calcLeftValue(+dotSecondValue.text())}px`);
        this.filler.elem.css('width',`${dotSecond.position().left + (dotWidth / 2)}px`);
        minElem.text(options.min);
        maxElem.text(options.max);

        //for a compact and comfortable values display

        if ((dotSecond.position().left + ((dotSecondValueWidth - dotWidth) / 2) + dotWidth) >= maxElem.position().left) {
            maxElem.addClass('hidden');
        }


        if (options.double) {
            dotFirstValue
                .text(this.checkForValuesOverride(this.options.from))
                .addClass('shown');
            dotFirst
                .addClass('shown')
                .css('left', `${this.calcLeftValue(+dotFirstValue.text())}px`);
            this.filler.elem.css({
                left: `${dotFirst.position().left + (dotWidth / 2)}px`,
                width: `${dotSecond.position().left - dotFirst.position().left}`
            })
            const dotFirstValueWidth = dotFirstValue.outerWidth() as number;

            //for a compact and comfortable values display
            if ( 
                ( dotSecond.position().left - ((dotSecondValueWidth - dotWidth) / 2) ) <= 
                ( dotFirst.position().left + ((dotFirstValueWidth - dotWidth) / 2) + dotWidth ) 
            ) {
                dotFirstValue.css('opacity', '0')
                dotSecondValue.text(`${dotFirstValue.text()} - ${dotSecondValue.text()}`);
            }
            if ((dotFirst.position().left - ((dotFirstValueWidth - dotWidth) / 2)) <= (minElemWidth / 2)) {
                minElem.addClass('hidden');
            }
        }

/*         if (this.options.vertical) {
            this.slider.addClass('slider_vertical');
            this.bar.addClass('slider__bar_vertical');
            this.filler.addClass('slider__filler_vertical');
            this.dotWrapperSecond.css({
                top: `${
                (this.options.startValueSecond > this.options.max) ? ((this.options.max - this.options.min) / (this.options.max - this.options.min))*sliderWidth - (dotWrapperSecondWidth / 2) :
                ((this.options.startValueSecond - this.options.min) / (this.options.max - this.options.min))*sliderWidth - (dotWrapperSecondWidth / 2)
                }px`,
                left: `0`
            });
        } */
    }

    mouseMove = (event: Event) => {
        const slider = this.slider.elem,
            sliderWidth = slider.outerWidth() as number,
            dotSecond = this.dot.elemSecond,
            dotSecondValue = this.dot.valueSecond,
            dotSecondValueWidth = dotSecondValue.outerWidth() as number,
            dotFirst = this.dot.elemFirst,
            dotFirstValue = this.dot.valueFirst,
            dotFirstValueWidth = dotFirstValue.outerWidth() as number,
            options = this.options,
            dotWidth = this.dot.elemSecond.outerWidth() as number,
            currentDot = event.currentTarget,
            currentWrapper = currentDot.parentElement as HTMLElement,
            currentDotValue = currentWrapper.lastElementChild as HTMLElement;

        event.preventDefault();

        const moveAt = (pageX: number, pageY: number) => {
            
            const dotFirstPos = dotFirst.position(),
                  dotSecondPos = dotSecond.position(),
                  sliderPos = slider.position();

            console.log(this.dotSecondValue);

            if ( (pageX <= (sliderPos.left + sliderWidth) ) && (pageX >= sliderPos.left)) {
                let cursorCoords = (pageX - sliderPos.left);
                
                currentDotValue.textContent = `${this.calculatedSliderValue(cursorCoords)}`;

                currentWrapper.style.left = `${this.calcLeftValue(+currentDotValue.textContent)}px`;

                if (options.double) {
                    if (dotSecondPos.left < dotFirstPos.left) {
                        currentWrapper.style.left = currentDot.classList.contains('js-slider__dot_first') ? `${100}px` : `${dotFirstPos.left}px`;
                    }
                    //for a compact and comfortable values display

                    if ( 
                        ( dotSecondPos.left - ((dotSecondValueWidth - dotWidth) / 2) ) <= 
                        ( dotFirstPos.left + ((dotFirstValueWidth - dotWidth) / 2) + dotWidth ) 
                    ) {
                        dotFirstValue.css('opacity', '0');
                        dotSecondValue.text(`${this.calculatedSliderValue(dotFirstPos.left)} - ${this.calculatedSliderValue(dotSecondPos.left)}`)
                    } 
                };

                if (this.options.vertical) {

                }
                this.filler.elem.css({
                    width: `${this.calcLeftValue(+dotSecondValue.text()) + (dotWidth / 2) - dotFirstPos.left - (dotFirst[0].offsetWidth / 2)}px`,
                    left: `${dotFirstPos.left + (dotFirst[0].offsetWidth / 2)}px`
                });

            }
        };
    
        const onMouseMove = (e: { pageX: number, pageY: number }) => {
            moveAt(e.pageX, e.pageY);
        };
    
        moveAt(event.pageX, event.pageY);

        const mouseup = () => {
            $(document).off('mousemove', onMouseMove);
            //this.dots.off('mouseup', mouseup);
        }
        $(document).on('mousemove', onMouseMove);
        $(document).on('mouseup', mouseup);
    }

    mouseDownHandler = (handler: (event: Event) => void) => {
        this.dots.on('mousedown', handler);
    }

    mouseMoveHandler = (handler: (event: Event) => void) => {
        this.dots.on('mousemove', handler);
    }

    documentMouseMoveHandler = (handler: () => void) => {
        $(document).on('mousemove', handler);
    }

    getDotsValues() {
        const dotFirstWidth = this.dot.elemFirst[0].offsetWidth,
              dotSecondWidth = this.dot.elemSecond[0].offsetWidth
        return {
            firstDot: this.calculatedSliderValue(this.dot.elemFirst.position().left + (dotFirstWidth / 2)),
            secondDot: this.calculatedSliderValue(this.dot.elemSecond.position().left + (dotSecondWidth / 2))
        }
    }

    calculatedSliderValue(cursorCoords : number) {
        return Math.round(
            ( (cursorCoords / (this.slider.elem.outerWidth() as number)) * 
            (this.options.max - this.options.min) + this.options.min ) / this.options.step
        ) * this.options.step
    }

    calcLeftValue(value: number) {
        const sliderWidth = this.slider.elem.outerWidth() as number,
              dotWidth = this.dot.elemSecond.outerWidth() as number;
        return ((value - this.options.min) / (this.options.max - this.options.min)) * sliderWidth - (dotWidth / 2);
    }

    checkForValuesOverride(value : number) {
        const options = this.options;
        if (value == options.to) {
            if(options.to > options.max){
                return options.max
            } else if (options.to < options.min){
                return options.min
            }
            return options.to
        } else {
            if (options.from > options.to) {
                return (options.to < options.min) ? options.min : options.to
            } else if (options.from > options.max) {
                return options.max
            } else if (options.from < options.min) {
                return options.min
            }
            return options.from
        }
    }

}

export { View };
