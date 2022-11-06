import React, { useCallback, useState, useRef } from 'react';
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
  let areLastWordsWhiteSpaceRef = useRef(false);
  let startIndexToScanRef = useRef(0);


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

  let onChangeQuillCb = useCallback(function(content: string, delta: DeltaStatic, source: Sources, editor: ReactQuill.UnprivilegedEditor){
    
    fetchWords(editor.getText(), "fr");
    setValue(content);
    
  }, [setValue]);

  return (
    <div>
      <ReactQuill ref={reactQuillRef} theme="snow" value={value} onChange={onChangeQuillCb} />
    </div>
  );
}

export default Home;
