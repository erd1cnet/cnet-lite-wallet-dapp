// helpers/queries.ts
export const GET_USER_TOKENS_AND_FACTORY_INFO = `
query GetUserTokensAndFactoryInfo($offset: Int = 0, $limit: Int = 500) {
  userTokens(offset: $offset, limit: $limit) {
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
    }
    price
    type
    valueUSD
  }
  
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
    }
    price
    type
  }
  
  factory {
    address
    pairCreationEnabled
    commonTokensForUserPairs
    totalVolumeUSD24h
    minSwapAmount
  }
}
`;

export const CHECK_PAIR_EXISTENCE_FALSE = `
query ($firstTokenID: String, $secondTokenID: String, $issuedLpToken: Boolean) {
  pairs(
    firstTokenID: $firstTokenID
    secondTokenID: $secondTokenID
    issuedLpToken: $issuedLpToken
  ) {
    address
    firstToken {
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
      price
      type
      __typename
    }
    secondToken {
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
      price
      type
      __typename
    }
    info {
      totalSupply
      __typename
    }
    __typename
  }
}
`;

export const CHECK_PAIR_EXISTENCE_TRUE =`
  query ($firstTokenID: String, $secondTokenID: String, $issuedLpToken: Boolean) {
    pairs(
      firstTokenID: $firstTokenID
      secondTokenID: $secondTokenID
      issuedLpToken: $issuedLpToken
    ) {
      address
      firstToken {
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
        price
        type
        __typename
      }
      firstTokenPrice
      firstTokenPriceUSD
      firstTokenVolume24h
      firstTokenLockedValueUSD
      secondToken {
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
        price
        type
        __typename
      }
      secondTokenPrice
      secondTokenPriceUSD
      secondTokenVolume24h
      secondTokenLockedValueUSD
      initialLiquidityAdder
      liquidityPoolToken {
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
        price
        type
        __typename
      }
      state
      type
      lockedValueUSD
      info {
        reserves0
        reserves1
        totalSupply
        __typename
      }
      feesAPR
      feesUSD24h
      volumeUSD24h
      totalFeePercent
      specialFeePercent
      lockedTokensInfo {
        lockingSC {
          address
          lockedToken {
            assets {
              website
              description
              status
              pngUrl
              svgUrl
              __typename
            }
            decimals
            name
            collection
            ticker
            __typename
          }
          lpProxyToken {
            assets {
              website
              description
              status
              pngUrl
              svgUrl
              __typename
            }
            decimals
            name
            collection
            ticker
            __typename
          }
          farmProxyToken {
            assets {
              website
              description
              status
              pngUrl
              svgUrl
              __typename
            }
            decimals
            name
            collection
            ticker
            __typename
          }
          intermediatedPairs
          intermediatedFarms
          __typename
        }
        unlockEpoch
        __typename
      }
      feesCollector {
        address
        __typename
      }
      feeDestinations {
        address
        tokenID
        __typename
      }
      trustedSwapPairs
      whitelistedManagedAddresses
      __typename
    }
  }
`;


export const CREATE_PAIR_QUERY = `
  query createPair($firstTokenID: String!, $secondTokenID: String!) {
    createPair(firstTokenID: $firstTokenID, secondTokenID: $secondTokenID) {
      value
      receiver
      gasPrice
      gasLimit
      data
      chainID
      version
    }
  }
`;
