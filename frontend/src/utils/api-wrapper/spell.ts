
import axios from "axios";
import APIWrapperConfig from "./api-wrapper-config";
import qs from "qs";
export interface IPostSpell {
  text: string;
  lang: string;
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