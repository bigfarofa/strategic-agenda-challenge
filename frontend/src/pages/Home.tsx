import React, { useCallback, useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import {Sources, DeltaStatic} from 'quill';
import 'react-quill/dist/quill.snow.css';
import usePrevious from "../hooks/usePrevious";
import _ from "lodash";
import {postSpell, IPostSpellResponse, convertAPISpellSuggestionsToHashMap} from "../utils/api-wrapper/spell";

function onChangeQuill(){

}

function isWhitespace(char: string){
  let whitespaceRegExp = new RegExp(/\s/g);
  let res = whitespaceRegExp.exec(char);
  return res !== null;
}

function isSentenceTerminator(){

}



function Home() {

  const [value, setValue] = useState('');
  const prevValue = usePrevious<string>(value);
  const reactQuillRef = useRef<ReactQuill>(null);
  const thisRef = useRef<any>(null);
  let areLastWordsWhiteSpaceRef = useRef(false);
  let startIndexToScanRef = useRef(0);
  let modulesRef = useRef({
    toolbar: {
      container: [
        [{ 'language': ['PT', 'EN'] }],
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline','strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        'language': function(value: string){
          if (reactQuillRef.current && thisRef.current) {
        
            let thisDom = thisRef.current;
            const placeholderPickerItems = Array.prototype.slice.call(thisDom.querySelectorAll('.ql-language .ql-picker-item'));
    
            placeholderPickerItems.forEach(item => item.textContent = item.dataset.value);
            
            let pickerLabel = thisDom.querySelector('.ql-language .ql-picker-label');
            let newSpanElement = document.createElement("SPAN");
            newSpanElement.innerHTML = pickerLabel.getAttribute("data-value");
            if (pickerLabel) {
              let existentSpanElement = pickerLabel.querySelector("span");
              if (existentSpanElement) {
                pickerLabel.removeChild(existentSpanElement);
              }
              pickerLabel.prepend(newSpanElement);
            }
            
          }
        }
      }
    }
  });


  /**
   * We add a debounced function to not fetch suggestions immediatly,
   * preventing overload to the API. 
   * It will be only executed some seconds after the user stops writing.
   */
  let fetchWords = useCallback(_.debounce(function(text: string, lang: string){
    
    console.log("FETCH NOW");

    postSpell({text: text, lang: lang})
    .then((res) => {
      let data: IPostSpellResponse = JSON.parse(res.data) as IPostSpellResponse;
      console.log("DATA", data);
      let wordsThatHaveSuggetions = data.filter((e) => e.suggestions.length > 0);
      console.log(wordsThatHaveSuggetions);
      if (!reactQuillRef.current) {
        console.log("NO REF");
        return false;  
      }
      let editor = reactQuillRef.current.getEditor();
      let editorText = editor.getText();

      for(let wordSpell of wordsThatHaveSuggetions) {
        let wordPossiblyWrong = wordSpell.original;

        let regx = new RegExp(wordPossiblyWrong, "gi");
        let regxRes = regx.exec(editorText);
        while(regxRes !== null) {
          let indexFound = regxRes.index;
          let endIndex = wordPossiblyWrong.length - 1;
          
          editor.formatText(indexFound, wordPossiblyWrong.length, {wavy: true}, "api");
          regxRes = regx.exec(editorText);
        }
      }
      
      
    })
    .catch((err) => {
      console.error(err);
    })
    
    
    
  }, 2000), []);

  useEffect(function(){
    setTimeout(() => {
      // We need to manually supply the HTML content of our custom dropdown list
      
      if (reactQuillRef.current && thisRef.current) {
        
        let thisDom = thisRef.current;
        const placeholderPickerItems = Array.prototype.slice.call(thisDom.querySelectorAll('.ql-language .ql-picker-item'));

        placeholderPickerItems.forEach(item => item.textContent = item.dataset.value);
        
        let pickerLabel = thisDom.querySelector('.ql-language .ql-picker-label');

        let newSpanElement = document.createElement("SPAN");
        newSpanElement.innerHTML = pickerLabel.getAttribute("data-value");
        if (pickerLabel) {
          let existentSpanElement = pickerLabel.querySelector("span");
          if (existentSpanElement) {
            pickerLabel.removeChild(existentSpanElement);
          }
          pickerLabel.prepend(newSpanElement);
        }
        reactQuillRef.current.getEditor().format('language', 'EN');
      }
      

    }, 0);
  }, []);

  let onChangeQuillCb = useCallback(function(content: string, delta: DeltaStatic, source: Sources, editor: ReactQuill.UnprivilegedEditor){
    
    fetchWords(editor.getText(), "fr");
    setValue(content);
    
  }, [setValue]);

  return (
    <div ref={thisRef}>
      <ReactQuill
      ref={reactQuillRef}
      theme="snow"
      value={value}
      onChange={onChangeQuillCb}
      modules = {modulesRef.current}
      />
    </div>
  );
}

export default Home;
