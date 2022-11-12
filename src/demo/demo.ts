import { Panel } from './panel/panel';

$('.js-querySlider#first-slider').slider({
  min: 0,
  max: 4000,
  vertical: false,
  double: false,
  to: 700,
  step: 1,
  scale: true,
  scaleFrequency: 9,
  valuesDisplay: false
});
$('.js-querySlider#second-slider').slider({
  min: -1000,
  max: 6600,
  vertical: false,
  double: true,
  from: 300,
  to: 3200,
  step: 17,
  scale: false,
  scaleFrequency: 9,
  valuesDisplay: true
});
$('.js-querySlider#third-slider').slider();
$('.js-querySlider').each(function setDemo(): void {
  // eslint-disable-next-line no-new
  new Panel($(this));
});
