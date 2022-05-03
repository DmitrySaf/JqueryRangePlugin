import { Model } from '../app/model/model';
//import { Presenter } from '../app/presenter/presenter';
import { View } from '../app/view/view';
import { IOptions } from '../app/options';

class Panel {
    model: Model;

    view: View;

    $elem: JQuery<HTMLElement>;

    options: IOptions;

    constructor(){
        this.$elem = $(`            
        <div class="slider__panel">
            <div class="panel__input_min_wrapper">
                <div class="panel__input_min_text">Min value: </div>
                <input type="number" class="panel__input_min js-panel__input_min">
            </div>
            <div class="panel__input_max_wrapper">
                <div class="panel__input_max_text">Max value: </div>
                <input type="number" class="panel__input_max js-panel__input_max">
            </div>
            <div class="panel__input_step_wrapper">
                <div class="panel__input_step_text">Step: </div>
                <input type="number" class="panel__input_step js-panel__input_step">
            </div>
        </div>`);
        this.options = { ...this.view.checkedOptions };
        this.onChange();
    }

    onChange = () => {
        this.$elem.find('input.panel__input_min').on('change', () => {
            const val = this.$elem.find('input.panel__input_min').val() as number;
            this.options.min = val;
            this.model.updateModelOptions(this.options, { from: this.options.from, to: this.options.to });
        })
    }
}

export { Panel };