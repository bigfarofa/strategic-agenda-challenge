import React, { useCallback, useState, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import ReactQuill from 'react-quill';
import {Sources, DeltaStatic} from 'quill';
import 'react-quill/dist/quill.snow.css';
import usePrevious from "./hooks/usePrevious";

function onChangeQuill(){

}

function isWhitespace(char: string){
  let whitespaceRegExp = new RegExp(/\s/g);
  let res = whitespaceRegExp.exec(char);
  return res !== null;
}



function App() {

  const [value, setValue] = useState('');
  const prevValue = usePrevious<string>(value);
  const reactQuillRef = useRef(null);
  let areLastWordsWhiteSpaceRef = useRef(false);
  let startIndexToScanRef = useRef(0);

  let onChangeQuillCb = useCallback(function(content: string, delta: DeltaStatic, source: Sources, editor: ReactQuill.UnprivilegedEditor){
    console.log(delta);
    console.log(source);
    console.log(content);
    console.log(editor.getText(), editor.getLength());
    

    let editorLength = editor.getLength();
    if(delta.ops){
      for(let op of delta.ops) {
        if(op.insert){
          let insertedChar = op.insert;
          let areLastWordsWhiteSpace = areLastWordsWhiteSpaceRef.current;
          let startIndexToScan = startIndexToScanRef.current;

          if(!areLastWordsWhiteSpace && isWhitespace(insertedChar)){
            let endRange = editor.getLength() - 1;
            console.log("FETCH FROM", startIndexToScan, "to", endRange); // EndIndex needs to be -2

            
            let text = editor.getText();
            console.log("text", text, text.length);
            let wordsToScanArr = text.split("");
            console.log("arr", wordsToScanArr);
            let wordsToScan = wordsToScanArr.slice(startIndexToScan, endRange).join("");
            console.log("wordsToScan", wordsToScan, wordsToScan.length);

            areLastWordsWhiteSpaceRef.current = true;
            
          }
          if (areLastWordsWhiteSpace && !isWhitespace(insertedChar)) {
            // Minus 2 Reason
            // -1 because the length is always greater by 1
            // -1 because the last index has always has a newline
            startIndexToScanRef.current = editor.getLength() - 2;
            areLastWordsWhiteSpaceRef.current = false;
          }
          
        }
      }
    }
    setValue(content);
    
  }, [setValue]);

  return (
    <div className="App">
      <ReactQuill ref={reactQuillRef} theme="snow" value={value} onChange={onChangeQuillCb} />
    </div>
  );
}

export default App;
