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
      this.addVerticalClasses();
    } else {
      this.removeVerticalClasses();
    }

    if (double) {
      this.firstDot.elem.classList.add('shown');
      this.moveAt(this.firstDot.elem, 'from');
    } else {
      this.firstDot.elem.classList.remove('shown');
      this.firstDot.elem.classList.add('hidden');
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
    this.input.classList.add('hidden');
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

  private onScaleClick = (event: PointerEvent) => {
    const { left, top } = $(event.currentTarget).position();
    const elemWidth = Number($(event.currentTarget).width());
    const elemHeight = Number($(event.currentTarget).height());
    const coords = this.checkedOptions.vertical
      ? {
        x: left,
        y: top + (elemHeight / 2)
      }
      : {
        x: left + (elemWidth / 2),
        y: top
      };
    const val = this.calcValue(coords);

    this.updateCurrentOptions(val, 'to');
    this.moveAt(this.dots[1], 'to');
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
      target.style.top = `${this.calcPosition(this.checkedOptions[optionName])}px`;
      target.style.left = '0px';
    } else {
      target.style.left = `${this.calcPosition(this.checkedOptions[optionName])}px`;
      target.style.top = '0px';
    }
  };

  private comfortableValueDisplay = () => {
    const {
      max,
      from,
      to,
      vertical
    } = this.checkedOptions;
    const posFrom = this.calcPosition(from);
    const posTo = this.calcPosition(to);
    const posMax = this.calcPosition(max);

    this.toggleMinMaxHidden(posMax - posTo, 'elemMax');
    this.toggleMinMaxHidden(posTo, 'elemMin');

    this.firstDot.value.textContent = String(from);
    this.secondDot.value.textContent = String(to);

    if (this.checkedOptions.double) {
      if ((posTo - posFrom) < 40) {
        this.firstDot.value.classList.add('hidden');
        this.firstDot.value.classList.remove('shown');
        this.secondDot.value.textContent = `${from} - ${to}`;
        if (!vertical) {
          this.secondDot.value.style.left = `calc(50% - ${(posTo - posFrom) / 2}px)`;
        }
      } else {
        this.firstDot.value.classList.remove('hidden');
        if (!vertical) this.secondDot.value.style.left = '50%';
      }
      this.toggleMinMaxHidden(posFrom, 'elemMin');
    }

    if (this.checkedOptions.valuesDisplay) {
      this.secondDot.value.classList.remove('hidden');
      this.firstDot.value.classList.remove('hidden');
      this.secondDot.value.classList.add('shown');
      this.firstDot.value.classList.add('shown');
    } else {
      this.secondDot.value.classList.remove('shown');
      this.firstDot.value.classList.remove('shown');
      this.secondDot.value.classList.add('hidden');
      this.firstDot.value.classList.add('hidden');
    }
  };

  private setFillerStyles = () => {
    const dotWidth = Number(this.secondDot.elem.offsetWidth);
    const { vertical } = this.checkedOptions;
    const posFrom = this.calcPosition(this.checkedOptions.from);
    const posTo = this.calcPosition(this.checkedOptions.to);

    this.bar.filler.style.top = `${
      vertical ? (posFrom + (dotWidth / 2)) : 0
    }px`;
    this.bar.filler.style.left = `${
      vertical ? 0 : (posFrom + (dotWidth / 2))
    }px`;
    this.bar.filler.style.height = `${
      vertical ? (posTo - posFrom) : 20
    }px`;
    this.bar.filler.style.width = `${
      vertical ? 20 : (posTo - posFrom)
    }px`;
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
      scaleElemsArray[0].style[option] = `${this.calcPosition(min, scaleElemsArray[0])}px`;

      for (let i = 1; i < frequency; i++) {
        scaleElemsArray[i].style[option] = `${this.calcPosition(
          Math.round((min + i * ((max - min) / frequency)) / step) * step,
          scaleElemsArray[i]
        )}px`;
      }

      scaleElemsArray[frequency].style[option] = `${this.calcPosition(max, scaleElemsArray[frequency])}px`;
    };

    if (frequency > 0) {
      if (vertical) {
        scaleElemsDisplay('top');
      } else {
        scaleElemsDisplay('left');
      }
    } else if (vertical) {
      (scaleElemsArray[0].style.top = `calc(50% - ${scaleElemsArray[0].clientHeight / 2}px)`);
    } else {
      (scaleElemsArray[0].style.left = `calc(50% - ${scaleElemsArray[0].clientWidth / 2}px)`);
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

  private addVerticalClasses = () => {
    this.slider.elem.classList.add('slider_vertical');
    this.bar.elem.classList.add('slider__bar_vertical');
    this.minmax.elemMin.classList.add('slider__min_vertical');
    this.minmax.elemMax.classList.add('slider__max_vertical');
    this.scale.container.classList.add('slider__scale_vertical');
  };

  private removeVerticalClasses = () => {
    this.slider.elem.classList.remove('slider_vertical');
    this.bar.elem.classList.remove('slider__bar_vertical');
    this.minmax.elemMin.classList.remove('slider__min_vertical');
    this.minmax.elemMax.classList.remove('slider__max_vertical');
    this.scale.container.classList.remove('slider__scale_vertical');
  };

  private toggleMinMaxHidden = (coords: number, elementName: 'elemMin' | 'elemMax'): void => {
    const elem = this.minmax[elementName] || document.createElement('div');

    if (coords < 50) {
      elem.classList.add('hidden');
    } else {
      elem.classList.remove('hidden');
    }
  };

  private calcValue = (cursorCoords: { x: number, y: number }): number => {
    const coordsToSliderRatio: number = this.checkedOptions.vertical
      ? cursorCoords.y / (Number(this.slider.elem.offsetHeight))
      : cursorCoords.x / (Number(this.slider.elem.offsetWidth));
    return Math.round(
      (coordsToSliderRatio
        * (this.checkedOptions.max - this.checkedOptions.min)
        + this.checkedOptions.min) / this.checkedOptions.step
    ) * this.checkedOptions.step;
  };

  private calcPosition = (value: number, target: HTMLElement = this.secondDot.elem): number => {
    const sliderHeight = Number(this.slider.elem.offsetHeight);
    const sliderWidth = Number(this.slider.elem.offsetWidth);
    const sliderProp = this.checkedOptions.vertical ? sliderHeight : sliderWidth;
    const dotWidth = this.checkedOptions.vertical
      ? Number(target.offsetHeight)
      : Number(target.offsetWidth);
    return (
      (value - this.checkedOptions.min)
      / (this.checkedOptions.max - this.checkedOptions.min)
    ) * sliderProp - (dotWidth / 2);
  };
}

export default View;
