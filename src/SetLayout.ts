type Option = {
  itemsWrapper: HTMLElement;
};
export default class SetLayout {
  private option: Option;
  private items: NodeListOf<HTMLDivElement>;
  constructor(option: Option) {
    this.option = option;
    this.items = document.querySelectorAll<HTMLDivElement>(".child");
  }

  public init() {
    // console.log(this.option);
    this.option.itemsWrapper.style.paddingBottom = `${(100 * this.items[0].clientHeight) / this.items[0].clientWidth}%`;
    this.items.forEach((el, index) => {
      const _this = el;
      _this.dataset.y = index.toString();
      _this.style.position = "absolute";
      _this.style.top = `${parseInt(_this.dataset.y) * 100}%`;
    });
  }
}
