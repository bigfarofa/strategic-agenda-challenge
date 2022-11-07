import Quill from "quill";
import Popover from "bootstrap/js/dist/popover";
import { DOMElement } from "react";
import isDescendant from "../../dom/is-descendant";
import BuildParchment from "./BuildParchment";
import {db} from '../../../dexie/dexie-db';


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
  static create(data: {original: string, suggestions: string[], lang?: string}) {
    let node = super.create() as Element;
    node.classList.add('text-wavy', 'ql-error-word');
    node.setAttribute("data-original", data.original);

    if (data.suggestions) {
      node.setAttribute("data-suggestions", data.suggestions.join(","));
      node.setAttribute("data-bs-container", "body");
      node.setAttribute("data-bs-toggle", "popover");
      node.setAttribute("data-bs-placement", "bottom");


      let popoverBody = document.createElement("DIV");
      let listNode = document.createElement("UL");
      listNode.classList.add("list-group", "suggestion-list-popover", "suggestion-list");
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
      optionsList.classList.add("list-group", "suggestion-list-popover", "action-list");

      let optionsIgnore = document.createElement("LI");
      optionsIgnore.innerHTML = '<i class="fa-regular fa-circle-xmark"></i> Ignore';
      optionsIgnore.classList.add("list-group-item", "list-group-item-action");
      optionsIgnore.setAttribute("data-original", data.original);
      optionsIgnore.addEventListener("click", function(){
        let word = this.getAttribute("data-original");
        let lang = data.lang;
        if (lang && word) {
          db.ignoredWords.add({
            word: word,
            lang: lang
          })
          .then((res) => {

          })
          .catch((err) => {
            console.error(err);
          })
        }
        
      })

      let optionsAddToDictionary = document.createElement("LI");
      optionsAddToDictionary.innerHTML = '<i class="fa-solid fa-book"></i> Add to Dictionary';
      optionsAddToDictionary.classList.add("list-group-item", "list-group-item-action");
      optionsAddToDictionary.setAttribute("data-original", data.original);

      

      optionsAddToDictionary.addEventListener("click", function(e){
        console.log("clicked List");
        console.log("THIS", this);
        console.log("Current Target", e.currentTarget);
        if (this) {
          let word = this.getAttribute("data-original");
          let parentNode = this.parentNode?.parentNode;
          console.log("parentNode", parentNode);
          if (parentNode) {
            let suggestionsDomElem = parentNode.querySelectorAll(".suggestion-list li");
            let docsToInsert = [];
            for(let i = 0; i < suggestionsDomElem.length; i++) {
              let text = suggestionsDomElem[i].textContent;
              let lang = data.lang;

              if (lang && word && text) {
                docsToInsert.push({
                  word: word,
                  wordAttached: text,
                  lang: lang
                })
              }
            }

            db.userDictionary.bulkAdd(docsToInsert)
            .then((res) => {
              console.log("userDict", res);
            })
            .catch((err) => {
              console.error(err);
            })

          }
          
        }
        
        
      })

      optionsList.append(optionsAddToDictionary, optionsIgnore);

      popoverBody.append(optionsList);
      //node.setAttribute("data-bs-content", data.suggestions.join("<br/>"));
      let popover = new Popover(node, {
        trigger: "click",
        html: true,
        content: popoverBody,
        animation: false,
        customClass: "suggestion-popover"
      })

      
      
      
      
     
    }
    
    

    return node;
  }

  static blotName: string = 'wavy';
  static tagName: string = 'wavy';
}

export class WavyBuildParchment extends BuildParchment {
  build(): void {
    Quill.register(WavyBlot, true);
    
    let mousedownCb = function(e: MouseEvent){
      let target = e.target as Element;
      let onePopover = document.querySelector(".suggestion-popover");
      if (onePopover) {
        if(!isDescendant(onePopover, target)){
          let allWordErrors = document.querySelectorAll(".ql-error-word");
          for(let i = 0; i < allWordErrors.length; i++){
            let wordError = allWordErrors[i];
            let popOverInstance = Popover.getInstance(wordError);
            
            if (popOverInstance) {
              popOverInstance.hide();
            }
          }
          
          
        }
      }
      
      
    };
    window.addEventListener("mouseup", mousedownCb);
  }
}
export default WavyBuildParchment;