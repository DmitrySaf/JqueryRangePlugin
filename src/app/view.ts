import './options';

interface Event {
    pageX: number,
    currentTarget: HTMLElement,
    preventDefault: any
}

class View {
    options: IOptions;

    dotTo: JQuery<HTMLElement>;

    dotFrom: JQuery<HTMLElement>;

    dot: JQuery<HTMLElement>;

    filler: JQuery<HTMLElement>;

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
        if (this.options.double) {
            this.dotFrom.addClass('shown')
        }
        this.dotTo.css('left', `${this.options.min - 10}px`);
        this.filler.css('width', `${this.options.min + 10}px`);
    }

    appendSlider = () => {
        this.input.before(`
            <div class="slider js-slider">
                <div class="slider__bar js-slider__bar"></div>
                <div class="slider__filler js-slider__filler"></div>
                <span class="slider__dot slider__dot_from js-slider__dot_from"></span>
                <span class="slider__dot slider__dot_to js-slider__dot_to"></span>
            </div>
        `);
    }

    elemsInit = () => {
        this.slider = this.input.prev()
        this.filler = this.slider.find('.js-slider__filler');
        this.dotFrom = this.slider.find('span.js-slider__dot_from');
        this.dotTo = this.slider.find('span.js-slider__dot_to');
        this.dot = this.slider.find('span');
    }

    onSliderMove = (event: Event) => {
        const dot = this.dot;
        const slider = this.slider[0];
        const dotTo = this.dotTo[0];
        const dotFrom = this.dotFrom[0];
        const currentDot = event.currentTarget;

        event.preventDefault();

        const moveAt = (pageX: number) => {
            if ( (pageX < (slider.offsetLeft + slider.offsetWidth) ) && (pageX > slider.offsetLeft) ) {
                currentDot.style.left = `${pageX - slider.offsetLeft - (currentDot.offsetWidth / 2)}px`;
                if (this.options.double) {
                    if (dotTo.offsetLeft <= (dotFrom.offsetLeft + dotFrom.offsetWidth)) {
                        currentDot.style.left = (currentDot.classList.contains('js-slider__dot_from')) ? `${dotTo.offsetLeft - dotTo.offsetWidth}px` : `${dotFrom.offsetLeft + dotFrom.offsetWidth}px`;
                    }
                }
                this.filler.css({
                    width: `${dotTo.offsetLeft - dotFrom.offsetLeft + (dotTo.offsetWidth / 2)}px`,
                    left: `${dotFrom.offsetLeft + (dotFrom.offsetWidth / 2)}px`
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

    mouseMoveHandler = (handler: (event: Event) => void) => {
        this.dot.on('mousedown', handler);
    }

    getDotCoords() {
        return {
            leftFrom: this.dotFrom[0].offsetLeft,
            leftTo: this.dotTo[0].offsetLeft
        }
    }

}

export { View };
