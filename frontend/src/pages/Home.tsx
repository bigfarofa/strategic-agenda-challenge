import React, { useCallback, useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import {Sources, DeltaStatic} from 'quill';
import 'react-quill/dist/quill.snow.css';
import usePrevious from "../hooks/usePrevious";
import _ from "lodash";
import {postSpell} from "../utils/api-wrapper/spell";
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
  const reactQuillRef = useRef(null);
  let areLastWordsWhiteSpaceRef = useRef(false);
  let startIndexToScanRef = useRef(0);


  /**
   * We add a debounced function to not fetch suggestions immediatly,
   * preventing overload to the API.
   */
  let fetchWords = useCallback(_.debounce(function(text: string, lang: string){
    
    console.log("FETCH NOW");

    postSpell({text: text, lang: lang})
    .then((res) => {
      console.log(res.data);
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
