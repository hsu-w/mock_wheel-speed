import { gsap } from "gsap";
type Option = {
  itemsWrapper: HTMLElement;
  dom: HTMLElement;
  type: "Vertical" | "Horizontal";
  // ease: number;
  // current: number;
  // target: number;
  // last: number;
};
type DirectionSet = {
  first: "top" | "left";
  last: "bottom" | "right";
};
type Direction = "top" | "bottom" | "left" | "right";
type DatasetType = "x" | "y";
export default class BoundReset {
  private option: Option;
  private currentItemFirst: HTMLElement;
  private currentItemLast: HTMLElement;
  private directionSet: DirectionSet;
  private dom: HTMLElement;
  private itemsWrapper: HTMLElement;
  private datasetType: DatasetType;
  private observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // gsap.to(entry.target, {
          //   // scale: 1,
          //   opacity: 1,
          //   duration: 0.5,
          //   ease: "power2.out",
          // });
        }
      });
    },
    { root: null, threshold: 0.5, rootMargin: "0px" },
  );
  constructor(option: Option) {
    this.option = option;
    this.itemsWrapper = this.option.itemsWrapper;
    this.currentItemFirst = this.itemsWrapper.querySelector(
      ".child:first-child",
    ) as HTMLElement;
    this.currentItemLast = this.itemsWrapper.querySelector(
      ".child:last-child",
    ) as HTMLElement;
    this.dom = this.option.dom;
    this.datasetType = this.option.type == "Vertical" ? "y" : "x";
    this.directionSet = {
      first: this.option.type == "Vertical" ? "top" : "left",
      last: this.option.type == "Vertical" ? "bottom" : "right",
    };
    this.detect = this.detect.bind(this);
    this.getValue = this.getValue.bind(this);
    this.setObserver(this.itemsWrapper.querySelectorAll(".child"));
  }
  detect() {
    if (
      this.getValue(
        this.currentItemFirst.getBoundingClientRect(),
        this.directionSet.first,
      ) -
        this.getValue(
          this.dom.getBoundingClientRect(),
          this.directionSet.first,
        ) >
      0
      // this.currentTopRow.getBoundingClientRect().top - this.dom.getBoundingClientRect().top > 0
    ) {
      console.log("上　生成");
      const child_first = this.itemsWrapper.querySelector(
        ".child:first-child",
      ) as HTMLDivElement;
      const num_first = parseInt(child_first.dataset[this.datasetType] || "0");
      const num_first_new = num_first - 1;
      const child_last = this.itemsWrapper.querySelector(
        ".child:last-child",
      ) as HTMLDivElement;
      const child_lastsecond = this.itemsWrapper.querySelector(
        ".child:nth-last-child(2)",
      ) as HTMLDivElement;
      child_last.dataset[this.datasetType] = num_first_new.toString();
      child_last.style.top = `${num_first_new * 100}%`;
      this.currentItemLast = child_lastsecond;

      // gsap.set(child_last, {
      //   opacity: 0,
      //   // scale: 0.5,
      // });
      this.itemsWrapper.prepend(child_last);
      this.currentItemFirst = child_last;
    }
    if (
      this.getValue(
        this.currentItemLast.getBoundingClientRect(),
        this.directionSet.last,
      ) -
        this.getValue(
          this.dom.getBoundingClientRect(),
          this.directionSet.last,
        ) <
      0
      // this.currentBottomRow.getBoundingClientRect().bottom - this.dom.getBoundingClientRect().bottom < 0
    ) {
      console.log("下　生成");
      const child_last = this.itemsWrapper.querySelector(
        ".child:last-child",
      ) as HTMLDivElement;
      const num_last = parseInt(child_last.dataset.y || "0");
      const num_last_new = num_last + 1;
      const child_first = this.itemsWrapper.querySelector(
        ".child:first-child",
      ) as HTMLDivElement;
      const child_second = this.itemsWrapper.querySelector(
        ".child:nth-child(2)",
      ) as HTMLDivElement;
      child_first.dataset.y = num_last_new.toString();
      child_first.style.top = `${num_last_new * 100}%`;
      this.currentItemFirst = child_second;
      // gsap.set(child_first, {
      //   opacity: 0,
      //   // scale: 0.5,
      // });
      this.itemsWrapper.append(child_first);
      this.currentItemLast = child_first;
    }
  }
  getValue(poz: DOMRect, type: Direction) {
    return poz[type];
  }
  setObserver(targets: NodeListOf<HTMLDivElement>) {
    targets.forEach((item) => {
      this.observer.observe(item);
    });
  }
}
