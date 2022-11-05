
import axios from "axios";
import APIWrapperConfig from "./api-wrapper-config";

export interface IPostSpell {
  text: string;
  lang: string;
}


function postSpell(data: IPostSpell){
  let apiConfig = new APIWrapperConfig();
  let url = apiConfig.hostname() + "/api/spell";
  return axios.post(url, data);
}