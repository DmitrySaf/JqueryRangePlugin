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

    // создать ивенты с handler в презентере

    init = () => {
        this.appendSlider();
        this.elemsInit();
        this.render();
    }

    render = () => {
        this.input.addClass('hidden');
        this.dotWrapperSecond.css('left', `-${this.dotSecond[0].offsetWidth / 2}px`);
        if (this.options.double) {
            this.dotWrapperFirst.addClass('shown');
            this.dotWrapperFirst.css('left', `-${this.dotSecond[0].offsetWidth / 2}px`);
            this.dotWrapperSecond.css('left', `${this.dotFirst[0].offsetWidth / 2}px`);
            this.filler.css('width', `${this.dotFirst[0].offsetWidth}px`);
            this.dotFirstValue.addClass('shown');
            this.dotSecondValue.text(this.dotWrapperSecond[0].offsetLeft + (this.dotWrapperSecond[0].offsetWidth / 2))
        }
    }

    appendSlider = () => {
        this.input.before(`
            <div class="slider js-slider">
                <div class="slider__bar js-slider__bar"></div>
                <div class="slider__filler js-slider__filler"></div>
                <div class="slider__dot_wrapper_left js-slider__dot_wrapper_left">
                    <span class="slider__dot slider__dot_from js-slider__dot_from"></span>
                    <div class="slider__dot_from_value js-slider__dot_from_value">0</div>
                </div>
                <div class="slider__dot_wrapper_right js-slider__dot_wrapper_right">
                    <span class="slider__dot slider__dot_to js-slider__dot_to"></span>
                    <div class="slider__dot_to_value js-slider__dot_to_value">0</div>
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
        const dot = this.dot;
        const slider = this.slider[0];
        const dotTo = this.dotWrapperSecond[0];
        const dotFrom = this.dotWrapperFirst[0];
        const currentDot = event.currentTarget;
        const currentWrapper = currentDot.parentElement as HTMLElement;
        const currentDotValue = currentWrapper.lastElementChild as HTMLElement

        event.preventDefault();

        const moveAt = (pageX: number) => {
            if ( (pageX < (slider.offsetLeft + slider.offsetWidth + 2) ) && (pageX > slider.offsetLeft) ) {
                currentWrapper.style.left = `${pageX - (currentWrapper.offsetWidth / 2) - slider.offsetLeft}px`;
                if (this.options.double) {
                    if (dotTo.offsetLeft <= (dotFrom.offsetLeft + dotFrom.offsetWidth)) {
                        currentWrapper.style.left = (currentDot.classList.contains('js-slider__dot_from')) ? `${dotTo.offsetLeft - dotTo.offsetWidth}px` : `${dotFrom.offsetLeft + dotFrom.offsetWidth}px`;
                    }
                };
                this.filler.css({
                    width: `${dotTo.offsetLeft + (dotTo.offsetWidth / 2) - dotFrom.offsetLeft - (dotFrom.offsetWidth / 2)}px`,
                    left: `${dotFrom.offsetLeft + (dotFrom.offsetWidth / 2)}px`
                });
                console.log(((currentWrapper.offsetLeft + (currentWrapper.offsetWidth / 2) - 1) / (slider.offsetWidth)))
                currentDotValue.textContent = `${Math.round(((currentWrapper.offsetLeft + (currentWrapper.offsetWidth / 2) - 1) / (slider.offsetWidth)) * this.options.max)}`;
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

}

export { View };
