this.ml5lib=ml5;


    var sketch = (p: p5) => {
      let x = 100;
      let y = 100;
      console.log(p);
      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
      };

      p.draw = () => {
        p.background(0);
        p.fill(255);
        p.rect(x, y, 50, 50);
      };
    };

    new p5(sketch);
