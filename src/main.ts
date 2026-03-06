import "./reset.css";
import "./style.css";
import wheelAnimate from "./WheelAnimate.ts";
const wa = new wheelAnimate({
  border: ".wa__border",
  list: ".wa__list",
  child: ".wa__child",
  dir: false,
});
