import React, { useCallback, useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import {Sources, DeltaStatic} from 'quill';
import 'react-quill/dist/quill.snow.css';
import usePrevious from "../hooks/usePrevious";
import _ from "lodash";
import {postSpell, IPostSpellResponse, convertAPISpellSuggestionsToHashMap} from "../utils/api-wrapper/spell";

import QuillTranslator from '../components/quill-sta/QuillTranslator';



function Home() {
  let [italianTranslatorLanguage, setItalianTranslatorLanguage] = useState<string>("it");
  let onItalianLangChange = useCallback(function(e: React.ChangeEvent<HTMLSelectElement>){
    console.log("e", e);
    let value = e.target.value;
    setItalianTranslatorLanguage(value);
  }, [])

  return (
    <div>
      <div className="container">
        <div className="row mb-3">
          <QuillTranslator language='en-gb'/>
        </div>
        <div className='row mb-3'>
          <div className="col-12 col-md-6 mb-3">
            <QuillTranslator language='fr'/>
          </div>
          <div className="col-12 col-md-6 mb-3">
            <QuillTranslator language={italianTranslatorLanguage} onLanguageChange={onItalianLangChange}/>
          </div>
        </div>
      </div>
    </div>
    
  );
}

export default Home;
