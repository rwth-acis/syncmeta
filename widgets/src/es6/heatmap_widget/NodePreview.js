import loadHTML from "../html.template.loader";
const heatspotHtml = await loadHTML(
  "../../templates/heatmap_widget/heatspot.html",
  import.meta.url
);

class Heatspot {
  constructor(id, x, y, width, height, scaleFactor, color) {
    this.$node = $(heatspotHtml);
    this.originalX = x;
    this.originalY = y;
    this.originalWidth = width;
    this.originalHeight = height;
    this.scaleFactor = scaleFactor;
    this.draw();

    this.$node.addClass(id);

    if (color) {
      this.setColor(color);
    }

    //var that = this;

    // this.interval = setInterval(function(){
    //     that.opacity -= 0.01;
    //     that.$node.css("opacity", that.opacity);
    //     if(that.opacity <= 0){
    //         clearInterval(that.interval)
    //         that.remove();
    //     }
    // }, 1000)
  }
  get$node() {
    return this.$node;
  }
  remove() {
    this.$node.remove();
  }
  moveX(x) {
    this.originalX += x;
    this.draw();
  }
  moveY(y) {
    this.originalY += y;
    this.draw();
  }
  changeWidth(offsetWidth) {
    this.originalWidth += offsetWidth;
    this.draw();
  }
  changeHeight(offsetHeight) {
    this.originalHeight += offsetHeight;
    this.draw();
  }
  setScaleFactor(scaleFactor) {
    this.scaleFactor = scaleFactor;
    this.draw();
  }
  draw() {
    this.$node.css({
      top: this.originalY * this.scaleFactor,
      left: this.originalX * this.scaleFactor,
      width: this.originalWidth * this.scaleFactor,
      height: this.originalHeight * this.scaleFactor,
    });
  }
  setColor(color) {
    this.$node.find(".background").css({
      opacity: 1,
      "background-color": color,
    });
  }
  resetColor() {
    this.$node.find(".background").css({
      opacity: 0.5,
      "background-color": "white",
    });
  }
}

export default Heatspot;
