import { Presenter } from '../../app/mvp/presenter/presenter';

class Panel {

    private app: Presenter;

    //private slider: JQuery<HTMLElement>;

    private panel: JQuery<HTMLElement>;

    private inputMin: JQuery<HTMLElement>;

    private inputMax: JQuery<HTMLElement>;

    private inputFrom: JQuery<HTMLElement>;

    private inputTo: JQuery<HTMLElement>;

    private inputStep: JQuery<HTMLElement>;

    private inputVertical: JQuery<HTMLElement>;

    private inputDouble: JQuery<HTMLElement>;

    private inputScale: JQuery<HTMLElement>;

    private inputScaleFrequency: JQuery<HTMLElement>;

    private inputNumber: JQuery<HTMLElement>;

    private inputCheckbox: JQuery<HTMLElement>;

    constructor(input: JQuery) {
        //this.slider = input.prev();
        this.app = input.data('slider');
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
        this.inputVertical = panel.find('input.js-panel__input_vertical');
        this.inputDouble = panel.find('input.js-panel__input_double');
        this.inputScale = panel.find('input.js-panel__input_scale');
        this.inputScaleFrequency = panel.find('input.js-panel__input_scaleFrequency');
        this.inputNumber = panel.find('input.panel__input[type="number"]');
        this.inputCheckbox = panel.find('input.panel__input_checkbox[type="checkbox"]');
    }

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
            scaleFrequency
        } = this.app.view.checkedOptions;
        this.inputMin.val(min);
        this.inputMax.val(max);
        this.inputFrom.val(from);
        this.inputTo.val(to);
        this.inputStep.val(step);
        this.inputVertical.prop('checked', vertical);
        this.inputDouble.prop('checked', double);
        this.inputScale.prop('checked', scale);
        this.inputScaleFrequency.val(scaleFrequency);
    }

    private addEventListeners = (): void => {
        this.inputNumber.on('blur', this.onBlur);
        this.inputNumber.on('keyup', this.onKeyUp);
        this.inputCheckbox.on('change', this.onCheck);
/*         this.inputMin.on('blur', function () {
            const options = $.extend(app.view.checkedOptions, {max: +($(this).val() as number)});
            app.updateModelOptions(options, { from: 300, to: 700});
        });
        this.inputMin.on('keyup', function (event) {
            if (event.key === 'Enter') {
                const options = $.extend(app.view.checkedOptions, {max: +($(this).val() as number)});
                app.updateModelOptions(options, { from: 300, to: 700});
            }
        }); */
    }

    private onBlur = (event: {target: HTMLElement}): void => {
/*         const { app } = this;
        const {
            inputMin,
            inputMax,
            inputFrom,
            inputTo,
            inputStep
        } = this;
        const input = $(event.target);

        const options = $.extend(app.view.checkedOptions, {max: +($(this).val() as number)});
        app.updateModelOptions(options, { from: 300, to: 700}); */
    }

    private onKeyUp = (event: { key: string }): void => {
        //const { app } = this;

        if (event.key === 'Enter') {

        } else return;
    }

    private onCheck = (event: { target: HTMLElement }): void => {
        //const { app } = this;

    }
}

export { Panel };