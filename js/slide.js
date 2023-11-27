import debounce from "./debounce.js";

export class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.dist = {
      finalPosition: 0,
      startX: 0,
      movement: 0,
    };
  }

  transition(active) {
    this.slide.style.transition = active ? "transform .3s" : "";
  }

  moveSlide(distanciaX) {
    this.dist.changedPosition = distanciaX; // isso eh igual a (numero de onde comecou - numero de onde parou o movimento)
    this.slide.style.transform = `translate3d(${distanciaX}px, 0, 0)`;
  }

  uptadePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.5; //estou apenas acelerando o movimento multiplicando o numero por 1*5
    // console.log(this.dist.finalPosition, this.dist.movement);
    return this.dist.finalPosition - this.dist.movement;
  }

  onStart(event) {
    let movetype;
    if (event.type === "mousedown") {
      event.preventDefault();
      this.dist.startX = event.clientX;
      movetype = "mousemove";
    } else {
      this.dist.startX = event.changedTouches[0].clientX;
      movetype = "touchmove";
      // console.log(this.dist.startX);
    }
    this.wrapper.addEventListener(movetype, this.onMove);
    this.transition(false);
  }

  onMove(event) {
    if (event.type === "mousemove") {
      const finalPosition = this.uptadePosition(event.clientX);
      this.moveSlide(finalPosition);
    } else {
      const finalPosition = this.uptadePosition(
        event.changedTouches[0].clientX
      ); //ate onde se moveu;
      this.moveSlide(finalPosition);
    }

    // // console.log(finalPosition);
    // this.moveSlide(finalPosition);
    // // console.log('movendo', finalPosition)
  }

  onEnd(event) {
    const movetype = event.type === "mouseup" ? "mousemove" : "touchmove";
    this.wrapper.removeEventListener(movetype, this.onMove);
    this.dist.finalPosition = this.dist.changedPosition;
    //ESSE EH O VALOR DO FINAL POSITION
    this.changeSlideOnEnd();
    this.transition(true);
  }

  changeSlideOnEnd() {
    if (this.dist.movement > 120 && this.index.next !== undefined) {
      this.activeNextSlide();
    } else if (this.dist.movement < -120 && this.index.prev !== undefined) {
      this.activePrevSlide();
    } else {
      this.changeSlide(this.index.active);
    }
  }

  addevent() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
    this.wrapper.addEventListener("touchstart", this.onStart);
    this.wrapper.addEventListener("touchend", this.onEnd);
  }

  //slide config
  slidePosition(slide) {
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margin);
  }

  slidesConfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return { position, element };
    });
  }

  slidesIndexNav(index) {
    const last = this.slideArray.length - 1;
    this.index = {
      prev: index === 0 ? undefined : index - 1,
      active: index,
      next: index === last ? undefined : index + 1,
    };
  }

  changeSlide(index) {
    // const ActiveSlide = this.slideArray[index];
    this.moveSlide(this.slideArray[index].position);
    this.slidesIndexNav(index);
    // console.log(this.index);
    this.dist.finalPosition = this.slideArray[index].position;
    this.changeActiveClass();
  }

  changeActiveClass() {
    this.slideArray.forEach((item) => item.element.classList.remove("active"));
    this.slideArray[this.index.active].element.classList.add("active");
  }

  activePrevSlide() {
    if (this.index.prev !== undefined) {
      this.changeSlide(this.index.prev);
    }
  }

  activeNextSlide() {
    if (this.index.next !== undefined) {
      this.changeSlide(this.index.next);
    }
  }

  onResize() {
    console.log("teste");
    setTimeout(() => {
      this.slidesConfig();
      this.changeSlide(this.index.active);
    }, 800);
  }

  onResizeEvent() {
    window.addEventListener("resize", this.onResize);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.slidesConfig = this.slidesConfig.bind(this);
    this.onResize = debounce(this.onResize.bind(this), 50);
    this.activePrevSlide = this.activePrevSlide.bind(this);
    this.activeNextSlide = this.activeNextSlide.bind(this);
  }

  init() {
    this.transition(true);
    this.slidesConfig();
    this.bindEvents();
    this.addevent();
    this.onResizeEvent();
    this.changeSlide(0);
    return this;
  }
}

//entender o codigo antes de continuar, pois se vc continuar sem ao menos entender, sera uma vergonha.

//O FINALPOSITION EH O VALOR QUE ESTA INDO PARA O ESTILO DE TRANSFORM DO CSS.

//console.log(event.clientX)//posicao na qual o mouse esta/parou quando se moveu ou esta se movendo, tipo um vigia de posicionamento

//this.dist.startX = event.clientX;//onde comecou

//this.dist.changedPosition = distanciaX;// isso eh igual a (numero de onde comecou - numero de onde parou o movimento)

//EU INICIO A INTERACAO COM O SLIDE, AI O ONSTART CHAMA A FUNCAO DE ONMOVE E NESSA FUNCAO A CONST FINAL POSITION RECEBE O RETORNO DA FUNCAO UPDATEPOSITION, E AI DPS DISSO CHAMA A FUNCAO MOVESLIDE PASSANDO COMO PARAMETRO A CONST FINALPOSITION,

//EXPLICACAO DO VALOR DA THIS.DIST.FINAL POSITION = PRIMEIRO EU MEXO O SLIDE DE 0 A -30PX E AI ISSO VAI SER O VALOR DO MEU THIS.DIST.MOVEMENT E O VALORR INICIAL DE THIS.DIST.FINAL POSITION EH 0 MAS QUANDO EU  TERMINO ESSE MOVIMENTO NO SLIDE O FINALPOSITION RECEBE O VALOR QUE DEU NO RETORNO DA UPDATEPOSITION '30' (0-30 = -30) E ASSIM VAI INDO SUCESSIVAMENTE E A CADA INTERACAO COM O SLIDE ELE VAI RECEBENDO O VALORR DO RETORNO DO UPDATEPOSITION, E ASSIM A CADA INTERACAO Q EU FACO COM O SLIDE, ELE COMECA A PARTIR DO LUGAR Q EU PAREI

//const finalPosition = this.uptadePosition(event.clientX)//ate onde se moveu;

//const movetype = (event.type === 'mouseup') ? 'mousemove' : 'touchmove' //se o even.type for mouseup entao recebe mousemove se nao touchmove

//EU NAO PRECISO USAR O CONSTRUCTOR SE O CONSTRUCTOR FOR IGUAL.

export class SlideNav extends Slide {
  addArrow(prev, next) {
     this.prevElement = document.querySelector(prev);
     this.nextElement = document.querySelector(next);
     this.addArrowEvent()
  }

  addArrowEvent(){
    this.prevElement.addEventListener('click', this.activePrevSlide);
    this.nextElement.addEventListener('click', this.activeNextSlide);
  }
}
