import { GET_TOKENS, GET_USER_BALANCES, SWAP_TOKENS } from './queries';
import { GRAPHQL_ENDPOINT, API_URL } from 'config';


const fetchGraphQL = async (query: string, variables: any = {}) => {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    const json = await response.json();

    if (json.errors) {
      throw new Error(json.errors.map((error: any) => error.message).join('\n'));
    }

    return json.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const fetchTokens = async () => {
  const data = await fetchGraphQL(GET_TOKENS);
  return data.tokens;
};

export const fetchUserBalances = async (address: string) => {
  const data = await fetchGraphQL(GET_USER_BALANCES, { address });
  return data.userBalances;
};

export const executeSwap = async (variables: { amountIn: string, tokenInID: string, tokenOutID: string, tolerance: number }) => {
  const data = await fetchGraphQL(SWAP_TOKENS, variables);
  return data.swap;
};

export const getBalanceFromApi = async (address: string) => {
  try {
    const response = await fetch(`${API_URL}/accounts/${address}/tokens?type=FungibleESDT&fields=identifier,balance,decimals`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error || 'Failed to fetch balances');
    }

    return json;
  } catch (error) {
    console.error('Error fetching balances:', error);
    throw error;
  }
};
