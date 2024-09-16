import axios from "axios";
import { axiosConfig } from ".";


export async function getUserTokenBalance(apiAddress, address, tokenIds) {
  const configUrl = `${apiAddress}/accounts/${address}/tokens?identifiers=${tokenIds}&fields=identifier,balance`;
  try {
    const { data } = await axios.get(configUrl, axiosConfig);
    return data;
  } catch (e) {
    console.error(e);
    //toastError(ERROR_MVX_API_FAILED);
  }
  return [];
}
