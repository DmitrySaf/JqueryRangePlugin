import { View } from './view';

class Controller {
    slider: View;

    constructor(slider: View) {
        this.slider = slider;
        this.mouseMove();
    }

    mouseMove() {
        this.slider.minSlider.onmousedown = (event) => {
            const moveAt = (pageX: number) => {
                if (pageX < 1012 && pageX > 512) {
                    this.slider.minSlider.style.left = `${pageX - 512 - this.slider.minSlider.offsetWidth / 2}px`;
                }
            };
            moveAt(event.pageX);

            const onMouseMove = (e: { pageX: number; }) => {
                moveAt(e.pageX);
            };

            document.addEventListener('mousemove', onMouseMove);

            document.onmouseup = () => {
                document.removeEventListener('mousemove', onMouseMove);
                this.slider.minSlider.onmouseup = null;
            };
        };
        this.slider.minSlider.ondragstart = () => false;
    }
}

export { Controller };
