import { useEffect, useState } from 'react';
import { fetchTokens, getBalanceFromApi } from '../helpers';
import { TokenType } from '../types';
import { useGetAccountInfo, useGetLoginInfo } from 'lib';
import { nativeAuth } from '@multiversx/sdk-dapp/services/nativeAuth/nativeAuth';

export const useCreatePoolForm = () => {
  const [filteredUserTokens, setFilteredUserTokens] = useState<TokenType[]>([]);
  const [commonTokens, setCommonTokens] = useState<TokenType[]>([]);
  const [tokens, setTokens] = useState<TokenType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { address } = useGetAccountInfo();
  const { tokenLogin } = useGetLoginInfo();
  const { getToken } = nativeAuth();

  let nativeAuthToken = tokenLogin?.nativeAuthToken;

  if (!nativeAuthToken && tokenLogin?.loginToken && tokenLogin?.signature) {
    nativeAuthToken = getToken({
      address: address,
      token: tokenLogin.loginToken,
      signature: tokenLogin.signature,
    });
  }

  useEffect(() => {
    const fetchTokenOptions = async () => {
      if (nativeAuthToken) {
        try {
          const graphQlData = await fetchTokens(nativeAuthToken);

          setTokens(graphQlData.tokens);

          const apiData = await getBalanceFromApi(address);


          const formattedCommonTokens = graphQlData.factory.commonTokensForUserPairs
            .map((identifier: string) => {
              const commonToken = graphQlData.tokens.find(
                (token: TokenType) => token.identifier === identifier
              );

              const userToken = apiData.find(
                (token: TokenType) => token.identifier === identifier
              );

              return {
                ...commonToken,
                balance: userToken?.balance || '0', 
                decimals: userToken?.decimals || 18 
              };
            })
            .filter(Boolean) as TokenType[];

          setCommonTokens(formattedCommonTokens);

          const userOwnedTokens = apiData.filter(
            (token: TokenType) =>
              token.owner === address && 
              !formattedCommonTokens.some(commonToken => commonToken.identifier === token.identifier) 
          );
          setFilteredUserTokens(userOwnedTokens);
        } catch (error) {
          console.error('Error fetching tokens:', error);
          setError('Error fetching tokens');
        }
      }
    };

    fetchTokenOptions();
  }, [address, tokenLogin]);

  return {
    tokens,
    filteredUserTokens,
    commonTokens,
    error,
  };
};
