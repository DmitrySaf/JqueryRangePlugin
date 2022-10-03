import { Presenter } from '../../app/mvp/presenter/presenter';
import './panel.sass';

class Panel {
  private app: Presenter;

  private slider: JQuery<HTMLElement>;

  private sliderDots: JQuery<HTMLElement>;

  private panel: JQuery<HTMLElement>;

  private inputMin: JQuery<HTMLElement>;

  private inputMax: JQuery<HTMLElement>;

  private inputFrom: JQuery<HTMLElement>;

  private inputTo: JQuery<HTMLElement>;

  private inputStep: JQuery<HTMLElement>;

  private inputValuesDisplay: JQuery<HTMLElement>;

  private inputVertical: JQuery<HTMLElement>;

  private inputDouble: JQuery<HTMLElement>;

  private inputScale: JQuery<HTMLElement>;

  private inputScaleFrequency: JQuery<HTMLElement>;

  private inputNumber: JQuery<HTMLElement>;

  private inputCheckbox: JQuery<HTMLElement>;

  constructor(input: JQuery) {
    this.app = input.data('slider') as Presenter;
    this.slider = input.prev();
    this.sliderDots = this.slider.find('span').parent();
    this.panel = input.parent().next();
    this.initInputs();
    this.fillInputs();
    this.addEventListeners();
  }

  private initInputs = (): void => {
    const { panel } = this;
    this.inputMin = panel.find('input.js-panel__input_min');
    this.inputMax = panel.find('input.js-panel__input_max');
    this.inputFrom = panel.find('input.js-panel__input_from');
    this.inputTo = panel.find('input.js-panel__input_to');
    this.inputStep = panel.find('input.js-panel__input_step');
    this.inputValuesDisplay = panel.find('input.js-panel__input_valuesDisplay');
    this.inputVertical = panel.find('input.js-panel__input_vertical');
    this.inputDouble = panel.find('input.js-panel__input_double');
    this.inputScale = panel.find('input.js-panel__input_scale');
    this.inputScaleFrequency = panel.find('input.js-panel__input_scaleFrequency');
    this.inputNumber = panel.find('input.panel__input[type="number"]');
    this.inputCheckbox = panel.find('input.panel__checkbox[type="checkbox"]');
  };

  private fillInputs = (): void => {
    const {
      min,
      max,
      step,
      from,
      to,
      vertical,
      double,
      scale,
      scaleFrequency,
      valuesDisplay
    } = this.app.view.checkedOptions;
    this.inputMin.val(min);
    this.inputMax.val(max);
    this.inputFrom.val(from);
    this.inputTo.val(to);
    this.inputStep.val(step);
    this.inputValuesDisplay.prop('checked', valuesDisplay);
    this.inputVertical.prop('checked', vertical);
    this.inputDouble.prop('checked', double);
    this.inputScale.prop('checked', scale);
    this.inputScaleFrequency.val(scaleFrequency);
  };

  private addEventListeners = (): void => {
    this.inputNumber.on('blur', this.onBlur);
    this.inputNumber.on('keyup', this.onKeyUp);
    this.inputCheckbox.on('change', this.onCheck);
    this.sliderDots.on('mousedown', this.onMouseDown);
  };

  private onMouseDown = () => {
    const fillToFromInputs = () => {
      this.inputFrom.val(this.app.view.checkedOptions.from);
      this.inputTo.val(this.app.view.checkedOptions.to);
    };
    const mousemove = () => {
      $(document).off('mousemove', fillToFromInputs);
      $(document).off('mouseup', mousemove);
    };
    $(document).on('mousemove', fillToFromInputs);
    $(document).on('mouseup', mousemove);
  };

  private onBlur = (event: { target: HTMLElement }): void => {
    const option = String($(event.target).attr('data-option'));
    const value = Number($(event.target).val());

    this.appUpdate({ [option]: value });
    this.fillInputs();
  };

  private onKeyUp = (event: { key: string, target: HTMLElement }): void => {
    const option = String($(event.target).attr('data-option'));
    const value = Number($(event.target).val());

    if (event.key === 'Enter') {
      this.appUpdate({ [option]: value });
      this.fillInputs();
    }
  };

  private onCheck = (event: { target: HTMLElement }): void => {
    const option = String($(event.target).attr('data-option'));
    const value = Boolean($(event.target).prop('checked'));
    if (option === 'double') {
      this.appUpdate({
        double: value,
        from: Number(this.inputFrom.val())
      });
    } else {
      this.appUpdate({ [option]: value });
    }
  };

  private appUpdate = (value: { [prop: string]: number | boolean }) => {
    const options = $.extend(this.app.view.checkedOptions, value);
    this.app.updateModelOptions(options, this.app.view.modelStatic);
    this.app.view.render();
  };
}

export { Panel };
