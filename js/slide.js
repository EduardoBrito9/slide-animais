export default class Slide {
  constructor(wrapper, slide) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.dist = {
      finalPosition: 0,
      startX: 0,
      movement: 0,
    };
  }

  moveSlide(distanciaX) {
    this.dist.changedPosition = distanciaX;// isso eh igual a (numero de onde comecou - numero de onde parou o movimento)
    this.slide.style.transform = `translate3d(${distanciaX}px, 0, 0)`
  }

  uptadePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.5; //estou apenas acelerando o movimento multiplicando o numero por 1*5
    console.log(this.dist.finalPosition, this.dist.movement);
    return this.dist.finalPosition - this.dist.movement;
  }

  onStart(event) {
    event.preventDefault();
    this.dist.startX = event.clientX;//onde comecou
    // console.log('comecou aqui ' + this.dist.startX)
    this.wrapper.addEventListener("mousemove", this.onMove);
  }

  onMove(event) {
    const finalPosition = this.uptadePosition(event.clientX)//ate onde se moveu;
    // console.log(finalPosition);
    this.moveSlide(finalPosition);
    // console.log('movendo', finalPosition)
  }

  onEnd() {
    this.wrapper.removeEventListener("mousemove", this.onMove);
    this.dist.finalPosition = this.dist.changedPosition;//ESSE EH O VALOR DO FINAL POSITION
  }

  addevent() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  init() {
    this.bindEvents();
    this.addevent();
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