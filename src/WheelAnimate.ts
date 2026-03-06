import { gsap } from "gsap";
import * as dat from "dat.gui";
type Option = {
  border: string;
  list: string;
  child: string;
  dir: boolean; //true : vertical , false: horizontal
};
interface CustomElement extends HTMLElement {
  count: number;
}
export default class WheelAnimate {
  private option: Option;
  private border: HTMLElement;
  private list: HTMLElement;
  private childs: NodeListOf<CustomElement>;
  private childsPics: NodeListOf<CustomElement>;
  private dir: boolean;
  private paused: boolean;
  private start: number | undefined;
  private speed: { t: number; c: number };
  private defaultSpeed: number;
  private direction: "up" | "down" | "";
  private delta: number;
  private sizeTotal: number = 0;
  private scroll: {
    ease: number; // Ease factor for smooth scrolling effect.
    current: number; // Current scroll position.
    target: number; // Desired scroll position.
    last: number; // Last recorded scroll position.
  };
  private boundSet: {
    first: keyof DOMRect;
    last: keyof DOMRect;
  } = { first: "top", last: "bottom" };
  private reverse: boolean;
  private curveLevel: number;
  private radiusLevel: number;
  constructor(option: Option) {
    this.render = this.render.bind(this);
    this.wheel = this.wheel.bind(this);
    this.setResize = this.setResize.bind(this);
    this.curve = this.curve.bind(this);
    this.speed = { t: 1, c: 1 };
    this.defaultSpeed = 0.5;
    this.direction = "";
    this.delta = 0;
    this.scroll = {
      ease: 0.05, // Ease factor for smooth scrolling effect.
      current: 0, // Current scroll position.
      target: 0, // Desired scroll position.
      last: 0, // Last recorded scroll position.
    };
    this.paused = false;
    this.option = option;
    this.dir = this.option.dir;
    this.border = document.querySelector(this.option.border) as HTMLElement;
    this.list = document.querySelector(this.option.list) as HTMLElement;
    this.childs = document.querySelectorAll(
      this.option.child,
    ) as NodeListOf<CustomElement>;
    this.childsPics = document.querySelectorAll(
      `${this.option.child}--in`,
    ) as NodeListOf<CustomElement>;
    this.childs.forEach((el) => {
      el.count = 0;
    });
    this.curveLevel = 2;
    this.radiusLevel = 1;
    this.reverse = false;
    this.childsPics.forEach((el, index) => {
      const _blob = el.querySelector(".blob") as HTMLElement;
      _blob!.style.backgroundImage = `url(https://picsum.photos/id/${index}/400/400)`;
    });

    const timeline = gsap.timeline();
    timeline.set(this.childsPics, {
      scale: 0.1,
      opacity: 0,
    });

    timeline.to(this.childsPics, {
      scale: 0.7,
      opacity: 1,
      duration: 0.6,
      ease: "power3.out",
      stagger: { amount: 1.2 },
    });
    this.init();
  }
  init() {
    const gui = new dat.GUI();
    const obj = {
      direction: this.dir ? "verticle" : "horizontal",
      curveLevel: 2,
      radiusLevel: 1,
      defaultSpeed: 0.5,
      ease: 0.05,
    };
    gui
      .add(obj, "direction", ["vertical", "horizontal"])
      .onChange((newValue: string) => {
        this.dir = newValue == "vertical";

        this.list.dataset.direction = this.dir ? "vertical" : "horizontal";
        this.boundSet = {
          first: this.dir ? "top" : "left",
          last: this.dir ? "bottom" : "right",
        };
        this.childs.forEach((el) => {
          el.count = 0;
        });
        this.scroll = {
          ease: 0.05, // Ease factor for smooth scrolling effect.
          current: 0, // Current scroll position.
          target: 0, // Desired scroll position.
          last: 0, // Last recorded scroll position.
        };

        window.dispatchEvent(new Event("resize"));
      });

    gui.add(obj, "curveLevel", 1, 5, 0.01).onChange((newValue: number) => {
      this.curveLevel = newValue;
    });
    gui.add(obj, "radiusLevel", 0.5, 5, 0.01).onChange((newValue: number) => {
      this.radiusLevel = newValue;
    });
    gui.add(obj, "defaultSpeed", 0.1, 10, 0.01).onChange((newValue: number) => {
      this.defaultSpeed = newValue;
    });
    gui.add(obj, "ease", 0.01, 0.999, 0.001).onChange((newValue: number) => {
      this.defaultSpeed = newValue;
    });
    this.list.dataset.direction = this.dir ? "vertical" : "horizontal";
    window.addEventListener("wheel", this.wheel);
    if (window.location.hash !== "#stop") {
      this.setResize();
      this.render();
    }
  }
  render(t: number | undefined = undefined) {
    if (!this.paused) {
      if (t && this.start) {
        const elapsed = t - this.start;
        this.speed.c += (this.speed.t - this.speed.c) * 0.05;
        this.scroll.target += this.speed.c;
        this.scroll.current +=
          (this.scroll.target - this.scroll.current) * this.scroll.ease;
        this.delta = this.scroll.target - this.scroll.current;
        // Determine scroll direction.
        if (this.scroll.current > this.scroll.last) {
          // console.log("down");
          this.direction = "down";
          this.speed.t = this.defaultSpeed;
          this.reverse = false;
        } else if (this.scroll.current < this.scroll.last) {
          // console.log("up");
          this.direction = "up";
          this.speed.t = -this.defaultSpeed;
          this.reverse = true;
        }

        // Update element positions and continue rendering.
        this.updateElements(this.scroll.current, elapsed);
        this.scroll.last = this.scroll.current;
      }
      this.start = t;
    }
    window.requestAnimationFrame(this.render);
  }

  updateElements(scroll: number, t: number) {
    // console.log(this.direction);
    this.childs.forEach((el) => {
      if (this.direction == "up") {
        if (
          this.getRectValue(el, this.boundSet.first) <
          this.getRectValue(this.border, this.boundSet.first)
        ) {
          console.log(this.direction);
          el.count += 1;
        }
      } else {
        if (
          this.getRectValue(el, this.boundSet.last) >
          this.getRectValue(this.border, this.boundSet.last)
        ) {
          el.count -= 1;
        }
      }

      el.style.transform = this.dir
        ? `translate(${5 * this.curve(Math.min(Math.max(0, this.getRectValue(el, this.direction == "down" ? this.boundSet.last : this.boundSet.first) / window.innerHeight), 1), t)}px,${el.count * this.sizeTotal}px)`
        : `translate(${el.count * this.sizeTotal}px,${5 * this.curve(Math.min(Math.max(0, this.getRectValue(el, this.direction == "down" ? this.boundSet.last : this.boundSet.first) / window.innerWidth), 1), t)}px)`;
    });

    this.list.style.transform = this.dir
      ? `translate(0,${scroll}px)`
      : `translate(${scroll}px,0)`;
  }
  wheel(e: WheelEvent) {
    // Handle scroll input using mouse wheel.
    // let t = e.wheelDeltaY || -1 * e.deltaY;
    let t = -1 * e.deltaY;
    t *= 0.254;
    this.scroll.target += -t;
    // console.log(`scroll位置：${this.scroll.target}`);
  }
  setResize() {
    const resizing = () => {
      this.boundSet = {
        first: this.dir ? "top" : "left",
        last: this.dir ? "bottom" : "right",
      };
      this.sizeTotal = this.dir
        ? this.list.clientHeight
        : this.list.clientWidth;
    };
    window.addEventListener("resize", resizing);
    resizing();
  }
  getRectValue(target: HTMLElement, key: keyof DOMRect) {
    return target.getBoundingClientRect()[key] as number;
  }
  curve(y: number, t = 0) {
    // Curve effect to create non-linear animations.
    t = t * 0.0007;
    if (this.reverse)
      return (
        Math.cos(this.curveLevel * y * Math.PI + t) *
        (this.radiusLevel * 15 + (-5 * this.delta) / 100)
      );
    return (
      Math.sin(this.curveLevel * y * Math.PI + t) *
      (this.radiusLevel * 15 + (5 * this.delta) / 100)
    );
  }
}
