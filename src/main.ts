import "./reset.css";
import "./style.css";
import wheelAnimate from "./WheelAnimate.ts";
new wheelAnimate({
  border: ".wa__border",
  list: ".wa__list",
  child: ".wa__child",
  dir: false,
});
