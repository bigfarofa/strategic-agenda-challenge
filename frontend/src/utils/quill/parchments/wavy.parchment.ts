import Quill from "quill";
import Popover from "bootstrap/js/dist/popover";
let Parchment = Quill.import("parchment");
//import {Attributor, ClassAttributor, InlineBlot} from "parchment";
let Inline = Quill.import("blots/inline");
let ClassAttributor = Parchment.Attributor.Class;
console.log(Parchment);
let Attributor = Parchment.Attributor.Style;
export let TextDecorationType = new Attributor('text_decoration_style', 'text-decoration-style', {
  whitelist: ['solid', 'double', 'dotted', 'dashed', 'wavy']
});

export let TextDecorationColor = new Attributor('text_decoration_color', 'text-decoration-color');

export let TextDecorationLine = new Attributor('text_decoration_line', 'text-decoration-line');

let config = { scope: Parchment.Scope.BLOCK };

export let WavyText = new ClassAttributor('wavy', 'text-wavy', config);


export let SpanWrapper = "";


export class WavyBlot extends Inline {
  static create(data: {original: string, suggestions: string[]}) {
    let node = super.create();
    node.classList.add('text-wavy');
    node.setAttribute("data-original", data.original);

    if (data.suggestions) {
      node.setAttribute("data-suggestions", data.suggestions.join(","));
      node.setAttribute("data-bs-container", "body");
      node.setAttribute("data-bs-toggle", "popover");
      node.setAttribute("data-bs-trigger", "hover");
      node.setAttribute("data-bs-placement", "bottom");
      node.setAttribute("data-bs-content", data.suggestions.join("<br/>"));
      new Popover(node);
    }
    
    

    return node;
  }

  static blotName: string = 'wavy';
  static tagName: string = 'wavy';
}

export default WavyBlot;