import { gsap } from "gsap";
import SetLayout from "./SetLayout.ts";
import BoundReset from "./BoundReset.ts";
type Option = {
  itemsWrapper: HTMLElement;
  itemsWrapperOut: HTMLElement;
  ease: number;
  phase: number;
  base: number;
  last: number;
};
export default class Column {
  private option: Option;
  private itemsWrapper: HTMLElement;
  private itemsWrapperOut: HTMLElement;
  private dom: HTMLElement;
  private br: BoundReset;
  private itemsIn: NodeListOf<HTMLDivElement>;
  private phase = 0;
  private base = 0;
  private currentValue: number;
  private lastValue: number;
  private speed: number;
  private dirc: number;
  private range: number;
  private rangePlus: number;
  private targetSpeed: number;
  private tmpSpeed: number;
  private targetValue: number;
  private tmpValue: number;
  constructor(option: Option) {
    this.render = this.render.bind(this);
    this.setWheel = this.setWheel.bind(this);
    this.option = option;
    this.itemsWrapper = this.option.itemsWrapper;
    this.itemsWrapperOut = this.option.itemsWrapperOut;
    this.itemsIn = this.itemsWrapper.querySelectorAll(".child-in");
    this.dom = document.querySelector(".dom") as HTMLElement;
    this.phase = this.option.phase;
    this.base = this.option.base;
    this.dirc = 1;
    this.range = 40;
    this.rangePlus = 0;

    this.currentValue = 0;
    this.lastValue = 0;
    this.speed = 0;
    this.targetSpeed = 0;
    this.tmpSpeed = 0;
    this.targetValue = 0;
    this.tmpValue = 0;

    const sl = new SetLayout({
      itemsWrapper: this.option.itemsWrapper,
    });
    sl.init();
    this.setWheel();
    this.br = new BoundReset({
      itemsWrapper: this.itemsWrapper,
      dom: this.dom,
      type: "Vertical",
    });
    this.render();
  }
  setWheel = () => {
    this.dom.addEventListener(
      "wheel",
      (e) => {
        if (e.wheelDeltaY > 0) {
          this.dirc = 1;
        } else if (e.wheelDeltaY < 0) {
          this.dirc = -1;
        }
        e.preventDefault();

        const deltaY = -e.deltaY * 2;
        this.targetValue += deltaY;
      },
      { passive: false },
    );
  };
  setWave = () => {
    this.itemsIn.forEach((el, index) => {
      el.style.transform = `translate(${(this.range + this.rangePlus) * Math.sin(this.phase + (index * 2 * Math.PI) / this.itemsIn.length)}px, 0)`;
    });
  };
  render = () => {
    this.base += this.dirc * 2;
    this.itemsWrapperOut.style.transform = `translate(0, ${this.base}px)`;
    this.br.detect();
    this.tmpValue = this.tmpValue + (this.targetValue - this.tmpValue) * 0.075;
    // console.log(Math.abs(this.targetValue - this.tmpValue) / 0.005);
    this.phase += 0.005;
    // this.setWave();
    // this.rangePlus = Math.abs(this.targetValue - this.tmpValue) * 0.025;

    // this.phase += Math.max(
    //   0.05 - Math.abs(this.targetValue - this.tmpValue) * 0.01,
    //   0,
    // );
    this.itemsWrapper.style.transform = `translate(0,${this.tmpValue}px)`;

    window.requestAnimationFrame(this.render);
  };
}
