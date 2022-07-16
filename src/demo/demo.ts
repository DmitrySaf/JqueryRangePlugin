import { Panel } from './panel/panel';

$('.js-querySlider').slider({
    min: 0,
    max: 4000,
    vertical: false,
    double: false,
    from: 300,
    to: 700,
    step: 1,
    scale: true,
    scaleFrequency: 9
});
$('.js-querySlider').each(function setDemo(): void {
    new Panel($(this));
});