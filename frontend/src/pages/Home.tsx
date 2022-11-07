import React, { useCallback, useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import {Sources, DeltaStatic} from 'quill';
import 'react-quill/dist/quill.snow.css';
import usePrevious from "../hooks/usePrevious";
import _ from "lodash";
import {postSpell, IPostSpellResponse, convertAPISpellSuggestionsToHashMap} from "../utils/api-wrapper/spell";

import QuillTranslator from '../components/quill-sta/QuillTranslator';



function Home() {

  return (
    <div>
      <div className="container">
        <div className="row">
          <QuillTranslator/>
        </div>
        <div className='row'>
          <div className="col-12 col-md-6">
            AA
          </div>
          <div className="col-12 col-md-6">
            BB
          </div>
        </div>
      </div>
    </div>
    
  );
}

export default Home;
