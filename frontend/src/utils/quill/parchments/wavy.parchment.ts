import Quill from "quill";
import Popover from "bootstrap/js/dist/popover";
import { DOMElement } from "react";
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
    let node = super.create() as Element;
    node.classList.add('text-wavy');
    node.setAttribute("data-original", data.original);

    if (data.suggestions) {
      node.setAttribute("data-suggestions", data.suggestions.join(","));
      node.setAttribute("data-bs-container", "body");
      node.setAttribute("data-bs-toggle", "popover");
      node.setAttribute("data-bs-placement", "bottom");


      let popoverBody = document.createElement("DIV");
      let listNode = document.createElement("UL");
      listNode.classList.add("list-group", "suggestion-list-popover");
      for(let suggestion of data.suggestions) {
        let listElem = document.createElement("LI");
        listElem.innerText = suggestion;
        listElem.classList.add("list-group-item", "list-group-item-action");
        listNode.append(listElem);
      }

      let seperator = document.createElement("HR");
      popoverBody.append(listNode);
      popoverBody.append(seperator);

      let optionsList = document.createElement("UL");
      optionsList.classList.add("list-group", "suggestion-list-popover");

      let optionsIgnore = document.createElement("LI");
      optionsIgnore.innerHTML = '<i class="fa-regular fa-circle-xmark"></i> Ignore';
      optionsIgnore.classList.add("list-group-item", "list-group-item-action");

      let optionsAddToDictionary = document.createElement("LI");
      optionsAddToDictionary.innerHTML = '<i class="fa-solid fa-book"></i> Add to Dictionary';
      optionsAddToDictionary.classList.add("list-group-item", "list-group-item-action");
      
      optionsList.append(optionsAddToDictionary, optionsIgnore);

      popoverBody.append(optionsList);
      //node.setAttribute("data-bs-content", data.suggestions.join("<br/>"));
      let popover = new Popover(node, {
        trigger: "click",
        html: true,
        content: popoverBody,
        animation: false
      })

      /*
      let mousedownCb = function(e: MouseEvent){
        let target = e.target as Element;
        console.log("mouseup");
        if(target.contains(node)){
          console.log("OUT OF ZONE");
          popover.hide();
          
        }
      };
      document.addEventListener("mouseup", mousedownCb);
      */
      
     
    }
    
    

    return node;
  }

  static blotName: string = 'wavy';
  static tagName: string = 'wavy';
}

export default WavyBlot;