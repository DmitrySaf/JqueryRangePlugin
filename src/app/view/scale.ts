class Scale {
    public container: JQuery<HTMLElement>;

    public elem: JQuery<HTMLElement>;

    constructor() {
        this.container = $('<div class="slider__scale_container js-slider__scale_container"></div>');
        this.elem = $('<div class="slider__scale_elem js-slider__scale_elem"></div>');
    }

    public createElemsArray = (frequency: number, min: number, max: number) => {
        const array = [];

        if (frequency > 1) {
            for (let i = 0; i < frequency; i++) {
                array.push($(`
                    <div class="slider__scale_elem js-slider__scale_elem">${
                        Math.round( min + i * (max - min) / (frequency - 1) )
                    }</div>
                `));
            };
        } else {
            array.push($(`
                <div class="slider__scale_elem js-slider__scale_elem">${
                    Math.round( min + (max - min) / 2 )
                }</div>
            `))
        }
        return array;
    };

    public removeElem = (array: JQuery<HTMLDivElement>) => array.remove();
}

export { Scale };