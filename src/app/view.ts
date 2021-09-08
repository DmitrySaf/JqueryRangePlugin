import './options';

interface Event {
    pageX: number,
    currentTarget: HTMLElement,
    preventDefault: any
}

class View {
    options: IOptions;

    dotFirst: JQuery<HTMLElement>;
    
    dotSecond: JQuery<HTMLElement>;

    dot: JQuery<HTMLElement>;

    dotWrapperFirst: JQuery<HTMLElement>;

    dotWrapperSecond: JQuery<HTMLElement>;

    filler: JQuery<HTMLElement>;

    dotFirstValue: JQuery<HTMLElement>;
    
    dotSecondValue: JQuery<HTMLElement>;

    slider: JQuery<HTMLElement>;

    input : JQuery<HTMLElement>;

    wrapper : JQuery<HTMLElement>;

    constructor(input: JQuery<HTMLElement>, options: IOptions) {
        this.input = input;
        this.options = options;
        this.wrapper = this.input.parent(); 
        this.init();
    }

    init = () => {
        this.appendSlider();
        this.elemsInit();
        this.render();
    }

    render = () => {
        const dotWrapperSecondWidth = this.dotWrapperSecond.width() as number,
              sliderWidth = this.slider.width() as number;

        this.input.addClass('hidden');
        this.dotWrapperSecond.css('left', `${
            (this.options.startValueSecond > this.options.max) ? ((this.options.max - this.options.min) / (this.options.max - this.options.min))*sliderWidth - (dotWrapperSecondWidth / 2) :
            ((this.options.startValueSecond - this.options.min) / (this.options.max - this.options.min))*sliderWidth - (dotWrapperSecondWidth / 2)
        }px`);
        this.dotSecondValue.text(Math.round(
            (( this.dotWrapperSecond.position().left + (dotWrapperSecondWidth / 2)) / sliderWidth) * 
            (this.options.max - this.options.min) + this.options.min
        ));
        this.filler.css('width',`${this.dotWrapperSecond.position().left + (dotWrapperSecondWidth / 2)}px`)

        if (this.options.double) {
            this.dotWrapperFirst
                .addClass('shown')
                .css('left', `${
                    (this.options.startValueFirst > this.options.max) ? ((this.options.max - this.options.min) / (this.options.max - this.options.min))*sliderWidth - (dotWrapperSecondWidth / 2)  :
                    ((this.options.startValueFirst - this.options.min) / (this.options.max - this.options.min))*sliderWidth - (dotWrapperSecondWidth / 2)
                }px`);
            this.dotFirstValue
                .text(this.calculatedSliderValue( this.dotWrapperFirst.position().left + (dotWrapperSecondWidth / 2) ))
                .addClass('shown');
            this.dotSecondValue.text(this.calculatedSliderValue( this.dotWrapperSecond.position().left + (dotWrapperSecondWidth / 2) ));
            this.filler.css({
                left: `${this.dotWrapperFirst.position().left + (dotWrapperSecondWidth / 2)}px`,
                width: `${this.dotWrapperSecond.position().left - this.dotWrapperFirst.position().left}`
            })

            //for a compact and comfortable values display
            if ( 
                ( this.dotWrapperSecond[0].offsetLeft - ((this.dotSecondValue[0].offsetWidth - this.dotSecond[0].offsetWidth) / 2) ) <= 
                ( this.dotWrapperFirst[0].offsetLeft + ((this.dotFirstValue[0].offsetWidth - this.dotFirst[0].offsetWidth) / 2) + this.dotFirst[0].offsetWidth ) 
            ) {
                this.dotFirstValue[0].style.opacity = '0';
                this.dotSecondValue[0].textContent = `${this.options.startValueFirst} - ${this.options.startValueSecond}`;
            }
        }
    }

    appendSlider = () => {
        this.input.before(`
            <div class="slider js-slider">
                <div class="slider__bar js-slider__bar"></div>
                <div class="slider__filler js-slider__filler"></div>
                <div class="slider__dot_wrapper_left js-slider__dot_wrapper_left">
                    <span class="slider__dot slider__dot_from js-slider__dot_from"></span>
                    <div class="slider__dot_from_value js-slider__dot_from_value"></div>
                </div>
                <div class="slider__dot_wrapper_right js-slider__dot_wrapper_right">
                    <span class="slider__dot slider__dot_to js-slider__dot_to"></span>
                    <div class="slider__dot_to_value js-slider__dot_to_value"></div>
                </div>
            </div>
        `);
    }

    elemsInit = () => {
        this.slider = this.input.prev()
        this.filler = this.slider.find('.js-slider__filler');
        this.dotFirst = this.slider.find('span.js-slider__dot_from');
        this.dotSecond = this.slider.find('span.js-slider__dot_to');
        this.dot = this.slider.find('span');
        this.dotFirstValue = this.slider.find('.js-slider__dot_from_value');
        this.dotSecondValue = this.slider.find('.js-slider__dot_to_value');
        this.dotWrapperFirst = this.slider.find('.js-slider__dot_wrapper_left');
        this.dotWrapperSecond = this.slider.find('.js-slider__dot_wrapper_right')
    }

    onSliderMove = (event: Event) => {
        const dot = this.dot,
              slider = this.slider[0],
              dotFirst = this.dotWrapperFirst[0],
              dotSecond = this.dotWrapperSecond[0],
              dotFirstValue = this.dotFirstValue[0],
              dotSecondValue = this.dotSecondValue[0],
              currentDot = event.currentTarget,
              currentWrapper = currentDot.parentElement as HTMLElement,
              currentDotValue = currentWrapper.lastElementChild as HTMLElement;

        event.preventDefault();

        const moveAt = (pageX: number) => {
            if ( (pageX < (slider.offsetLeft + slider.offsetWidth + 2) ) && (pageX > slider.offsetLeft) ) {

                let cursorCoords = (pageX - slider.offsetLeft - (currentWrapper.offsetWidth / 2));
                
                currentDotValue.textContent = `${this.calculatedSliderValue(cursorCoords)}`;

                currentWrapper.style.left = `${(((+currentDotValue.textContent - this.options.min) / (this.options.max - this.options.min))) * 100 }%`;

                if (this.options.double) {
                    if (dotSecond.offsetLeft <= (dotFirst.offsetLeft + dotFirst.offsetWidth - dotSecond.offsetWidth + 2)) {
                        currentWrapper.style.left = (currentDot.classList.contains('js-slider__dot_from')) ? `${dotSecond.offsetLeft - 2}px` : `${dotFirst.offsetLeft + 2}px`;
                    }
                    //for a compact and comfortable values display

                    if ( 
                        ( dotSecond.offsetLeft - ((dotSecondValue.offsetWidth - dotSecond.offsetWidth) / 2) ) <= 
                        ( dotFirst.offsetLeft + ((dotFirstValue.offsetWidth - dotFirst.offsetWidth) / 2) + dotFirst.offsetWidth ) 
                    ) {
                        dotFirstValue.style.opacity = '0';
                        dotSecondValue.textContent = `${this.calculatedSliderValue(this.dotWrapperFirst.position().left)} - ${Math.round(this.calculatedSliderValue(this.dotWrapperSecond.position().left))}`;
                    } 
                };
                this.filler.css({
                    width: `${dotSecond.offsetLeft + (dotSecond.offsetWidth / 2) - dotFirst.offsetLeft - (dotFirst.offsetWidth / 2)}px`,
                    left: `${dotFirst.offsetLeft + (dotFirst.offsetWidth / 2)}px`
                });

            }
        };
    
        const onMouseMove = (e: { pageX: number; }) => {
            moveAt(e.pageX);
        };
    
        moveAt(event.pageX);
    
        document.addEventListener('mousemove', onMouseMove);
    
        document.onmouseup = () => {
            document.removeEventListener('mousemove', onMouseMove);
            dot.on('mouseup', () => null);                
        };
        dot.on('dragstart', () => false);
    }

    mouseDownHandler = (handler: (event: Event) => void) => {
        this.dot.on('mousedown', handler);
    }

    mouseMoveHandler = (handler: (event: Event) => void) => {
        this.dot.on('mousemove', handler);
    }

    getDotCoords() {
        return {
            firstDot: this.dotWrapperFirst[0].offsetLeft + (this.dotFirst[0].offsetWidth / 2) - 1,
            secondDot: this.dotWrapperSecond[0].offsetLeft + (this.dotSecond[0].offsetWidth / 2) - 1
        }
    }

    calculatedSliderValue(cursorCoords : number) {
        return Math.round(
            ( (cursorCoords / this.slider[0].offsetWidth) * 
            (this.options.max - this.options.min) + this.options.min ) / this.options.step
        ) * this.options.step
    }

}

export { View };
