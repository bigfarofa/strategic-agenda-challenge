
import axios from "axios";
import APIWrapperConfig from "./api-wrapper-config";

export interface IPostSpell {
  text: string;
  lang: string;
}


export function postSpell(data: IPostSpell){
  let apiConfig = new APIWrapperConfig();
  let url = apiConfig.origin() + "/api/spell.php";
  return axios.post(url, data);
}

export default {
  postSpell
}