
import axios from "axios";
import APIWrapperConfig from "./api-wrapper-config";
import qs from "qs";
export interface IPostSpell {
  text: string;
  lang: string;
}


export interface IPostSpellSuggestion {
  original: string,
  suggestions: string[]
}

export type IPostSpellResponse = IPostSpellSuggestion[];
export type IPostSpellSuggestionsHashMap = {[original: string] : string[]};

export function convertAPISpellSuggestionsToHashMap(arr: IPostSpellResponse){
  let hashMap: IPostSpellSuggestionsHashMap = {};
  for(let elem of arr) {
    hashMap[elem.original] = elem.suggestions;
  }
  /* ALTERNATIVE. While t might be faster, it's less readable.
  hashMap = arr.reduce<IPostSpellSuggestionsHashMap>((acc, e) => Object.assign(acc, {[e.original]: e.suggestions}), {});
  */

  return hashMap;
}


export function postSpell(data: IPostSpell){
  let apiConfig = new APIWrapperConfig();
  let url = apiConfig.origin() + "/api/spell.php";
  
  let content = qs.stringify(data);

  return axios.post(url, content, {
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    }
  });
}

export default {
  postSpell
}