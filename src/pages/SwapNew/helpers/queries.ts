// helpers/queries.ts
export const GET_TOKENS = `
query GetTokens {
  tokens {
    balance
    decimals
    name
    identifier
    ticker
    owner
    assets {
      website
      description
      status
      pngUrl
      svgUrl
      __typename
    }
    type
    price
    __typename
    
  }
}
`;

export const GET_USER_BALANCES = `
  query GetUserBalances($address: String!) {
    userBalances(address: $address) {
      identifier
      balance
      __typename
    }
  }
`;

export const SWAP_TOKENS = `
  query SwapTokens($amountIn: String!, $tokenInID: String!, $tokenOutID: String!, $tolerance: Float!) {
    swap(amountIn: $amountIn, tokenInID: $tokenInID, tokenOutID: $tokenOutID, tolerance: $tolerance) {
      amountIn
      amountOut
      tokenRoute
      pairs {
        address
      }
      swapType
      fees
      intermediaryAmounts
      pricesImpact
    }
  }
`;
