import React, { useCallback, useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import {Sources, DeltaStatic} from 'quill';
import 'react-quill/dist/quill.snow.css';
import usePrevious from "../../hooks/usePrevious";
import _ from "lodash";
import {postSpell, IPostSpellResponse, convertAPISpellSuggestionsToHashMap} from "../../utils/api-wrapper/spell";




function onChangeQuill(){

}

function isWhitespace(char: string){
  let whitespaceRegExp = new RegExp(/\s/g);
  let res = whitespaceRegExp.exec(char);
  return res !== null;
}

function isSentenceTerminator(){

}


export interface IQuillTranslatorProps {
  language?: string,
  onLanguageChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void,
}
function QuillTranslator(props: IQuillTranslatorProps) {
  const {language} = props;
  const [value, setValue] = useState('');
  const prevValue = usePrevious<string>(value);
  const reactQuillRef = useRef<ReactQuill>(null);
  const thisRef = useRef<any>(null);
  let areLastWordsWhiteSpaceRef = useRef(false);
  let startIndexToScanRef = useRef(0);


  // LANGUAGES BASED ON THE Language Code Identifiers(LCID)
  // https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-lcid/70feba9f-294e-491e-b6eb-56532684c37f?source=recommendations
  // 
  let languagesOptions = useRef([
    {value: "en-gb", label: "English-GB"},
    {value: "it", label: "Italian"},
    {value: "fr", label: "French"},
  ]);

  let _onLanguageChange = useCallback(function(){
    
    
    if (props.onLanguageChange) {
      console.log(arguments);
      console.log(arguments[0]);
      props.onLanguageChange.apply(null, arguments as unknown as [e: React.ChangeEvent<HTMLSelectElement>]);
    }
    
  }, [onlanguagechange]);

  useEffect(function(){
    
    
    if (reactQuillRef.current && language) {
      let editor = reactQuillRef.current.getEditor();
      let text = editor.getText();
      fetchWords(text, language);
    }
    
  }, [language]);

  

  let modulesRef = useRef({
    toolbar: {
      container: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline','strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        ['clean']
      ],
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

  let onChangeQuillCb = useCallback(function(content: string, delta: DeltaStatic, source: Sources, editor: ReactQuill.UnprivilegedEditor){
    if (language) {
      fetchWords(editor.getText(), language);
    }
    setValue(content);
    
  }, [language]);

  return (
    <div ref={thisRef}>
      
      <div className='row row-cols-sm-auto align-items-center justify-content-end'>
        <div className="col-12">
          <label>Language:</label>
        </div>
        <div className='col-12'>
          <select defaultValue={language} onChange={_onLanguageChange} className='form-control' style={{minWidth: "200px"}}>
            {languagesOptions.current.map((e) => 
              <option key={e.value} value={e.value}>{e.label}</option>
            )}
          </select>
        </div>
        
      </div>
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

export default QuillTranslator;

