import { IDefinedOptions, Coords } from '../../options';
import Bar from './bar';
import Dot from './dot';
import Slider from './slider';
import Minmax from './min-max';
import Scale from './scale';
import Event from '../../event';

interface PointerEvent {
  target: any,
  currentTarget: any,
  preventDefault: any
}

interface PointerEventCoords {
  pageX: number,
  pageY: number
}

class View {
  public updateViewOptionsObserver: Event;

  public currentOptions: IDefinedOptions;

  public modelStatic: Coords;

  public checkedOptions: IDefinedOptions;

  private slider: Slider;

  private firstDot: Dot;

  private secondDot: Dot;

  private dots: HTMLElement[];

  private bar: Bar;

  private minmax: Minmax;

  private input: HTMLElement;

  private scale: Scale;

  constructor(input: HTMLElement, options: IDefinedOptions) {
    this.input = input;
    this.checkedOptions = options;
    this.currentOptions = { ...options };
    this.updateViewOptionsObserver = new Event();
    this.slider = new Slider();
    this.bar = new Bar();
    this.firstDot = new Dot('first');
    this.secondDot = new Dot('second');
    this.dots = [this.firstDot.elem, this.secondDot.elem];
    this.minmax = new Minmax();
    this.scale = new Scale();
    this.modelStatic = { from: this.checkedOptions.from, to: this.checkedOptions.to };
    this.init();
  }

  public updateViewOptions = (
    modelOptions: IDefinedOptions,
    modelStatic: Coords
  ): void => {
    this.checkedOptions = { ...modelOptions };
    this.currentOptions = { ...modelOptions };
    this.modelStatic = { ...modelStatic };
  };

  public render = (): void => {
    const {
      min,
      max,
      vertical,
      double
    } = this.checkedOptions;
    if (vertical) {
      this.slider.elem.classList.add('slider_vertical');
    } else {
      this.slider.elem.classList.remove('slider_vertical');
    }

    if (double) {
      this.moveAt(this.firstDot.elem, 'from');
    } else {
      this.firstDot.elem.classList.add('slider_hidden');
    }

    if (this.checkedOptions.scale) {
      const scaleChildren = this.scale.container.children;

      this.comfortableScaleDisplay();
      for (let i = 0; i < scaleChildren.length; i++) {
        scaleChildren[i].addEventListener('click', this.onScaleClick);
      }
    } else {
      this.scale.removeScale();
    }

    this.setFillerStyles();
    this.minmax.elemMax.textContent = String(max);
    this.minmax.elemMin.textContent = String(min);

    this.moveAt(this.secondDot.elem, 'to');
    this.comfortableValueDisplay();
  };

  private init = () => {
    this.createSlider();
    this.render();
    this.addEventListeners();
  };

  private createSlider = () => {
    this.input.classList.add('slider_hidden');
    this.input.tabIndex = -1;
    this.slider.elem.append(
      this.bar.elem,
      this.minmax.elemMax,
      this.minmax.elemMin,
      this.scale.container,
      this.firstDot.elem,
      this.secondDot.elem
    );
    this.input.before(this.slider.elem);
  };

  private addEventListeners = () => {
    this.dots.forEach((item) => {
      item.addEventListener('pointerdown', this.onPointerDown);
    });
    this.bar.elem.addEventListener('click', this.onMouseClick);
  };

  private onPointerDown = (event: PointerEvent) => {
    event.preventDefault();

    const pointermove = (e: PointerEventCoords) => {
      if (event.target.parentElement.classList.contains('js-slider__dot-wrapper_order_first')) {
        this.updateCurrentOptions(this.getValueOfDot(e), 'from');
        this.moveAt(this.firstDot.elem, 'from');
      } else {
        this.updateCurrentOptions(this.getValueOfDot(e), 'to');
        this.moveAt(this.secondDot.elem, 'to');
      }
      this.comfortableValueDisplay();
      this.setFillerStyles();
      this.onPointerUp();
    };
    const pointerup = () => {
      document.removeEventListener('pointermove', pointermove);
      document.removeEventListener('pointerup', pointerup);
      this.onPointerUp();
    };
    document.addEventListener('pointermove', pointermove);
    document.addEventListener('pointerup', pointerup);
  };

  private onMouseClick = (event: PointerEventCoords) => {
    if (this.checkedOptions.double) {
      if (Math.abs(this.getValueOfDot(event) - this.currentOptions.from)
        <= Math.abs(this.getValueOfDot(event) - this.currentOptions.to)) {
        this.updateCurrentOptions(this.getValueOfDot(event), 'from');
        this.moveAt(this.firstDot.elem, 'from');
      } else {
        this.updateCurrentOptions(this.getValueOfDot(event), 'to');
        this.moveAt(this.secondDot.elem, 'to');
      }
    } else {
      this.updateCurrentOptions(this.getValueOfDot(event), 'to');
      this.moveAt(this.secondDot.elem, 'to');
    }
    this.comfortableValueDisplay();
    this.setFillerStyles();
  };

  private onPointerUp = () => {
    this.modelStatic.from = this.checkedOptions.from;
    this.modelStatic.to = this.checkedOptions.to;
  };

  private onScaleClick = (event: { target: EventTarget | null }) => {
    const elem = event.target as HTMLElement || document.createElement('div');
    const elemValue = Number(elem.getAttribute('data-value'));
    const {
      to,
      from,
      double
    } = this.checkedOptions;
    if (double) {
      if (Math.abs(to - elemValue) < Math.abs(from - elemValue)) {
        this.updateCurrentOptions(elemValue, 'to');
        this.moveAt(this.secondDot.elem, 'to');
      } else {
        this.updateCurrentOptions(elemValue, 'from');
        this.moveAt(this.firstDot.elem, 'from');
      }
    } else {
      this.updateCurrentOptions(elemValue, 'to');
      this.moveAt(this.secondDot.elem, 'to');
    }
    this.comfortableValueDisplay();
    this.setFillerStyles();
  };

  private getValueOfDot = (event: { pageX: number, pageY: number }): number => {
    const coords = {
      x: event.pageX - this.slider.elem.getBoundingClientRect().left,
      y: event.pageY - this.slider.elem.getBoundingClientRect().top
    };
    return this.calcValue(coords);
  };

  private updateCurrentOptions = (value: number, optionName: 'from' | 'to') => {
    this.currentOptions[optionName] = value;
    this.updateViewOptionsObserver.notify();
  };

  private moveAt = (target: HTMLElement, optionName: 'from' | 'to') => {
    if (this.checkedOptions.vertical) {
      target.style.top = `${this.calcPosition(this.checkedOptions[optionName])}%`;
      target.style.left = '0px';
    } else {
      target.style.left = `${this.calcPosition(this.checkedOptions[optionName])}%`;
      target.style.top = '0px';
    }
  };

  private comfortableValueDisplay = () => {
    const {
      max,
      from,
      to,
      vertical,
      valuesDisplay
    } = this.checkedOptions;
    const posFrom = this.calcPosition(from);
    const posTo = this.calcPosition(to);
    const posMax = this.calcPosition(max);

    this.toggleMinMaxHidden(posMax - posTo, 'elemMax');
    this.toggleMinMaxHidden(posTo, 'elemMin');

    this.firstDot.value.textContent = String(from);
    this.secondDot.value.textContent = String(to);

    if (valuesDisplay) {
      this.secondDot.value.classList.remove('slider_hidden');
      this.firstDot.value.classList.remove('slider_hidden');
    } else {
      this.secondDot.value.classList.add('slider_hidden');
      this.firstDot.value.classList.add('slider_hidden');
    }

    if (this.checkedOptions.double) {
      if ((posTo - posFrom) < 5) {
        this.firstDot.value.classList.add('slider_hidden');
        this.secondDot.value.textContent = `${from} - ${to}`;
        if (!vertical) {
          this.secondDot.value.style.left = `calc(50% - ${(posTo - posFrom) / 2}px)`;
        }
      } else {
        this.firstDot.value.classList.remove('slider_hidden');
        if (!vertical) this.secondDot.value.style.left = '50%';
      }
      this.toggleMinMaxHidden(posFrom, 'elemMin');
    }
  };

  private setFillerStyles = () => {
    const dotWidth = Number(this.secondDot.elem.offsetWidth);
    const { vertical } = this.checkedOptions;
    const posFrom = this.calcPosition(this.checkedOptions.from);
    const posTo = this.calcPosition(this.checkedOptions.to);

    this.bar.filler.style.top = `${
      vertical ? (posFrom + (dotWidth / 2)) : 0
    }%`;
    this.bar.filler.style.left = `${
      vertical ? 0 : posFrom
    }%`;
    this.bar.filler.style.height = `${
      vertical ? (posTo - posFrom) : 100
    }%`;
    this.bar.filler.style.width = `${
      vertical ? 100 : (posTo - posFrom)
    }%`;
  };

  private appendScaleElements = () => {
    const frequency = this.checkedOptions.scaleFrequency - 1;
    const {
      min,
      max,
      step,
      vertical
    } = this.checkedOptions;

    this.scale.container.append(...this.scale.createElemsArray(frequency, min, max, step));

    const scaleElemsArray = this.scale.container.querySelectorAll('div');
    const scaleElemsDisplay = (option: 'top' | 'left') => {
      scaleElemsArray[0].style[option] = `${this.calcPosition(min)}%`;

      for (let i = 1; i < frequency; i++) {
        scaleElemsArray[i].style[option] = `${this.calcPosition(
          Math.round((min + i * ((max - min) / frequency)) / step) * step
        )}%`;
      }

      scaleElemsArray[frequency].style[option] = `${this.calcPosition(max)}%`;
    };

    if (frequency > 0) {
      if (vertical) {
        scaleElemsDisplay('top');
      } else {
        scaleElemsDisplay('left');
      }
    } else if (vertical) {
      scaleElemsArray[0].style.top = `calc(50% - ${scaleElemsArray[0].clientHeight / 2}px)`;
    } else {
      scaleElemsArray[0].style.left = `${this.calcPosition((max - min) / 2)}px`;
    }
  };

  private comfortableScaleDisplay = () => {
    this.scale.removeScale();
    this.appendScaleElements();
    if (!this.checkedOptions.vertical) {
      const scaleElemsArray = this.scale.container.querySelectorAll('div');
      let sum = 0;
      const sliderWidth = Number(this.slider.elem.offsetWidth);

      for (let i = 0; i < (scaleElemsArray.length - 1); i++) {
        sum += scaleElemsArray[i].offsetWidth;
        if (sum > (sliderWidth - 100)) {
          this.checkedOptions.scaleFrequency -= 1;
        }
      }
      this.scale.removeScale();
      this.appendScaleElements();
      for (let i = 0; i < (this.scale.container.querySelectorAll('div').length - 1); i++) {
        const scaleElements = this.scale.container.querySelectorAll('div');
        if (Math.abs(scaleElements[i].offsetLeft - scaleElements[i + 1].offsetLeft) < 30) {
          scaleElements[i + 1].remove();
          this.checkedOptions.scaleFrequency -= 1;
        }
      }
    }
  };

  private toggleMinMaxHidden = (coords: number, elementName: 'elemMin' | 'elemMax'): void => {
    const elem = this.minmax[elementName] || document.createElement('div');

    if (coords < 5) {
      elem.classList.add('slider_hidden');
    } else {
      elem.classList.remove('slider_hidden');
    }
  };

  private calcValue = (cursorCoords: { x: number, y: number }): number => {
    const coordsToSliderRatio: number = this.checkedOptions.vertical
      ? cursorCoords.y / Number(this.slider.elem.offsetHeight)
      : cursorCoords.x / Number(this.slider.elem.offsetWidth);
    return Math.round(
      (coordsToSliderRatio
        * (this.checkedOptions.max - this.checkedOptions.min)
        + this.checkedOptions.min) / this.checkedOptions.step
    ) * this.checkedOptions.step;
  };

  private calcPosition = (value: number): number => ((
    (value - this.checkedOptions.min)
      / (this.checkedOptions.max - this.checkedOptions.min)
  ) * 100);
}

export default View;
