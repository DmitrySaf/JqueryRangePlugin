import { IDefinedOptions, Coords } from '../../options';
import { Bar } from './bar';
import { Dot } from './dot';
import { Slider } from './slider';
import { Minmax } from './minmax';
import { Scale } from './scale';
import { Event } from '../../event';

interface PointerEvent {
  pageX: number,
  pageY: number,
  currentTarget: HTMLElement,
  preventDefault: () => void
}

class View {
  public updateViewOptionsObserver: Event;

  public currentOptions: IDefinedOptions;

  public modelStatic: Coords;

  public checkedOptions: IDefinedOptions;

  private slider: Slider;

  private dot: Dot;

  private bar: Bar;

  private minmax: Minmax;

  private dots: JQuery<HTMLElement>;

  private input: JQuery<HTMLElement>;

  private scale: Scale;

  constructor(input: JQuery<HTMLElement>, options: IDefinedOptions) {
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
      this.dot.$elemFirst.addClass('shown');
      this.moveAt(this.dot.$elemFirst[0], 'from');
    } else {
      this.dot.$elemFirst.removeClass('shown');
      this.dot.$elemFirst.addClass('hidden');
    }

    if (this.checkedOptions.scale) {
      this.comfortableScaleDisplay();
      this.scale.$container.children().on('click', this.onScaleClick);
    } else {
      this.scale.removeScale();
    }

    this.setFillerStyles();
    this.minmax.$elemMax.text(max);
    this.minmax.$elemMin.text(min);

    this.moveAt(this.dot.$elemSecond[0], 'to');
    this.comfortableValueDisplay();
  };

  private init = () => {
    this.createSlider();
    this.render();
    this.addEventListeners();
  };

  private createSlider = () => {
    this.input.addClass('hidden');
    this.slider.$elem.append(
      this.bar.$elem,
      this.minmax.$elemMax,
      this.minmax.$elemMin,
      this.scale.$container,
      this.dot.$elemFirst,
      this.dot.$elemSecond
    );
    this.input.before(this.slider.$elem);
    this.dots = this.slider.$elem.find('span').parent();
  };

  private addEventListeners = () => {
    this.dots.on('mousedown', this.onMouseDown);
    this.bar.$elem.on('click', this.onMouseClick);
  };

  private onMouseDown = (event: PointerEvent) => {
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

  private onMouseClick = (event: PointerEvent) => {
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
      x: event.pageX - this.slider.$elem.position().left,
      y: event.pageY - this.slider.$elem.position().top
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

    this.toggleMinMaxHidden(posMax - posTo, '$elemMax');
    this.toggleMinMaxHidden(posTo, '$elemMin');

    this.dot.$valueSecond.text(to);
    this.dot.$valueFirst.text(from);

    if (this.checkedOptions.double) {
      if ((posTo - posFrom) < 40) {
        this.dot.$valueFirst
          .addClass('hidden')
          .removeClass('shown');
        this.dot.$valueSecond.text(`${from} - ${to}`);
        if (!vertical) {
          this.dot.$valueSecond.css({ left: `calc(50% - ${(posTo - posFrom) / 2}px)` });
        }
      } else {
        this.dot.$valueFirst.removeClass('hidden');
        if (!vertical) this.dot.$valueSecond.css('left', '50%');
      }
      this.toggleMinMaxHidden(posFrom, '$elemMin');
    }

    if (this.checkedOptions.valuesDisplay) {
      this.dot.$valueSecond.removeClass('hidden');
      this.dot.$valueFirst.removeClass('hidden');
      this.dot.$valueSecond.addClass('shown');
      this.dot.$valueFirst.addClass('shown');
    } else {
      this.dot.$valueSecond.removeClass('shown');
      this.dot.$valueFirst.removeClass('shown');
      this.dot.$valueSecond.addClass('hidden');
      this.dot.$valueFirst.addClass('hidden');
    }
  };

  private setFillerStyles = () => {
    const dotWidth = Number(this.dot.$elemSecond.outerWidth());
    const { vertical } = this.checkedOptions;
    const posFrom = this.calcPosition(this.checkedOptions.from);
    const posTo = this.calcPosition(this.checkedOptions.to);
    this.bar.$filler.css({
      top: `${
        vertical ? (posFrom + (dotWidth / 2)) : 0
      }px`,
      left: `${
        vertical ? 0 : (posFrom + (dotWidth / 2))
      }px`,
      height: `${
        vertical ? (posTo - posFrom) : 20
      }px`,
      width: `${
        vertical ? 20 : (posTo - posFrom)
      }px`
    });
  };

  private appendScaleElements = () => {
    const frequency = this.checkedOptions.scaleFrequency;
    const {
      min,
      max,
      step,
      vertical
    } = this.checkedOptions;

    this.scale.$container.append(this.scale.createElemsArray(frequency, min, max, step));

    const scaleElemsArray = this.scale.$container.find('div');
    const scaleElemsDisplay = (option: 'top' | 'left') => {
      scaleElemsArray.filter(':nth-child(1)').css(
        option,
        this.calcPosition(min, scaleElemsArray.filter(':nth-child(1)'))
      );
      for (let i = 1; i < (frequency - 1); i++) {
        scaleElemsArray.filter(`:nth-child(${i + 1})`).css(
          option,
          this.calcPosition(
            Math.round((min + i * ((max - min) / (frequency - 1))) / step) * step,
            scaleElemsArray.filter(`:nth-child(${i + 1})`)
          )
        );
      }
      scaleElemsArray.filter(`:nth-child(${frequency})`).css(
        option,
        this.calcPosition(max, scaleElemsArray.filter(`:nth-child(${frequency})`))
      );
    };

    if (frequency > 1) {
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
      const scaleElemsArray = this.scale.$container.children();
      let sum = 0;
      const sliderWidth = Number(this.slider.$elem.outerWidth());

      for (let i = 0; i < (scaleElemsArray.length - 1); i++) {
        sum += scaleElemsArray[i].offsetWidth;
        if (sum > (sliderWidth - 100)) {
          this.checkedOptions.scaleFrequency -= 1;
        }
      }
      this.scale.removeScale();
      this.appendScaleElements();
      for (let i = 0; i < (this.scale.$container.find('div').length - 1); i++) {
        const scaleElements = this.scale.$container.find('div');
        if (Math.abs(scaleElements[i].offsetLeft - scaleElements[i + 1].offsetLeft) < 30) {
          scaleElements[i + 1].remove();
          this.checkedOptions.scaleFrequency -= 1;
        }
      }
    }
  };

  private addVerticalClasses = () => {
    this.slider.$elem.addClass('slider_vertical');
    this.bar.$elem.addClass('slider__bar_vertical');
    this.minmax.$elemMin.addClass('slider__min_vertical');
    this.minmax.$elemMax.addClass('slider__max_vertical');
    this.scale.$container.addClass('slider__scale_container_vertical');
  };

  private removeVerticalClasses = () => {
    this.slider.$elem.removeClass('slider_vertical');
    this.bar.$elem.removeClass('slider__bar_vertical');
    this.minmax.$elemMin.removeClass('slider__min_vertical');
    this.minmax.$elemMax.removeClass('slider__max_vertical');
    this.scale.$container.removeClass('slider__scale_container_vertical');
  };

  private toggleMinMaxHidden = (coords: number, elementName: '$elemMin' | '$elemMax') => (
    (coords < 50)
      ? this.minmax[elementName].addClass('hidden')
      : this.minmax[elementName].removeClass('hidden')
  );

  private calcValue = (cursorCoords: { x: number, y: number }): number => {
    const coordsToSliderRatio: number = this.checkedOptions.vertical
      ? cursorCoords.y / (Number(this.slider.$elem.outerHeight()))
      : cursorCoords.x / (Number(this.slider.$elem.outerWidth()));
    return Math.round(
      (coordsToSliderRatio
        * (this.checkedOptions.max - this.checkedOptions.min)
        + this.checkedOptions.min) / this.checkedOptions.step
    ) * this.checkedOptions.step;
  };

  private calcPosition = (value: number, target: JQuery<HTMLElement> = this.dot.$elemSecond): number => {
    const sliderHeight = Number(this.slider.$elem.outerHeight());
    const sliderWidth = Number(this.slider.$elem.outerWidth());
    const sliderProp = this.checkedOptions.vertical ? sliderHeight : sliderWidth;
    const dotWidth = this.checkedOptions.vertical
      ? Number(target.outerHeight())
      : Number(target.outerWidth());
    return (
      (value - this.checkedOptions.min)
      / (this.checkedOptions.max - this.checkedOptions.min)
    ) * sliderProp - (dotWidth / 2);
  };
}

export { View };
