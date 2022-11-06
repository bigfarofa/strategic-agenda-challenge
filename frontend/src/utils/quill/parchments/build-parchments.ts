import Quill from 'quill';
import {WavyText, WavyBlot} from './wavy.parchment';


export function buildParchments(){
  //Quill.register(WavyText, true);
  Quill.register(WavyBlot, true);
}

export default buildParchments;
