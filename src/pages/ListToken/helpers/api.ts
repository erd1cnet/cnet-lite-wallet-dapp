import { GET_USER_TOKENS_AND_FACTORY_INFO, CHECK_PAIR_EXISTENCE_FALSE, CHECK_PAIR_EXISTENCE_TRUE } from './queries';
import { GRAPHQL_ENDPOINT, API_URL } from 'config';
import { TransactionWatcher, ITransactionOnNetwork } from "@multiversx/sdk-core";

const fetchGraphQL = async (query: string, variables: any = {}, token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: headers,
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

export const getBalanceFromApi = async (address: string) => {
  try {
    const response = await fetch(`${API_URL}/accounts/${address}/tokens?type=FungibleESDT&fields=identifier,balance,decimals,owner,assets,ticker`, {
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

export const checkPairExistence = async (firstTokenID: string, secondTokenID: string) => {
  const variablesFalse = {
    firstTokenID,
    secondTokenID,
    issuedLpToken: false
  };
  const variablesTrue = {
    firstTokenID,
    secondTokenID,
    issuedLpToken: true
  };

  const dataFalse = await fetchGraphQL(CHECK_PAIR_EXISTENCE_FALSE, variablesFalse);
  const dataTrue = await fetchGraphQL(CHECK_PAIR_EXISTENCE_TRUE, variablesTrue);

  return {
    falsePair: dataFalse.pairs,
    truePair: dataTrue.pairs,
  };
};

export const fetchTokens = async (token: string, offset: number = 0, limit: number = 500) => {
  const variables = { offset, limit };
  const data = await fetchGraphQL(GET_USER_TOKENS_AND_FACTORY_INFO, variables, token);
  return data;
};

export const checkRoles = async (pairAddress: string) => {
  try {
    const response = await fetch(`${API_URL}/tokens/${pairAddress}/roles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error || 'Failed to fetch roles');
    }

    const roles = json.find((item: any) => item.canLocalMint && item.canLocalBurn);
    return roles;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export const pollTransactionStatus = async (transactionHash: string): Promise<ITransactionOnNetwork | null> => {
  try {
    const transactionWatcher = new TransactionWatcher(
      {
        getTransaction: async (txHash: string) => {
          const response = await fetch(`${API_URL}/transactions/${txHash}`);
          const data: ITransactionOnNetwork = await response.json();  
          return data;
        }
      },
      { pollingIntervalMilliseconds: 1000 }
    );

    const transactionStatus = await transactionWatcher.awaitCompleted(transactionHash);

    console.log('Transaction completed:', transactionStatus);

    return transactionStatus;
  } catch (error) {
    console.error('Error tracking transaction:', error);
    return null;
  }
};