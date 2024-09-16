import { useEffect, useState } from 'react';
import { AbiRegistry, SmartContract, Address, BigUIntValue, BytesValue, ArgSerializer, TypedValue, AddressValue, IAddress } from "@multiversx/sdk-core";
import { sendTransactions, useGetAccountInfo, useGetNetworkConfig } from 'lib';
import { Transaction, TransactionPayload } from "@multiversx/sdk-core";
import { SwapTransactionParams, TokenType } from '../types';
import { SendTransactionsPropsType } from 'types';

import BigNumber from 'bignumber.js';
import { ROUTER_SC, SINGLE_SWAP_GAS_FEE, MULTI_PAIR_GAS_FEE } from 'config';

import pairAbi from 'abis/pair.abi.json';
import routerAbi from 'abis/router.abi.json';


export const useSwapTransaction = () => {
  const { account } = useGetAccountInfo();
  const [pairAbiRegistry, setPairAbiRegistry] = useState<AbiRegistry | null>(null);
  const [routerAbiRegistry, setRouterAbiRegistry] = useState<AbiRegistry | null>(null);
  const {network: { chainId }} = useGetNetworkConfig();  
  
  useEffect(() => {
    const loadAbi = async () => {
      try {
        const pairRegistry = AbiRegistry.create(pairAbi);
        const routerRegistry = AbiRegistry.create(routerAbi);

        setPairAbiRegistry(pairRegistry);
        setRouterAbiRegistry(routerRegistry);
      } catch (error) {
        console.error('Error loading ABI:', error);
      }
    };
    loadAbi();
  }, []);

  const prepareEsdtTransferArgs = (amountIn: string, selectedFromToken: TokenType): TypedValue[] => {
    const amountInBigInt = new BigUIntValue(new BigNumber(amountIn).times(new BigNumber(10).pow(selectedFromToken.decimals)).toFixed());
    return [
      BytesValue.fromUTF8(selectedFromToken.identifier),
      amountInBigInt,
    ];
  };

  const prepareSwapArgs = (amountOutMin: string, selectedToToken: TokenType): TypedValue[] => {
    const amountOutMinBigInt = new BigUIntValue(new BigNumber(amountOutMin).times(new BigNumber(10).pow(selectedToToken.decimals)).toFixed());
    return [
      BytesValue.fromUTF8(selectedToToken.identifier),
      amountOutMinBigInt,
    ];
  };

  const prepareMultiPairSwapArgs = (
    pairs: { address: string }[],
    tokenRoute: string[],
    intermediaryAmounts: string[],
    slippage: number
  ): TypedValue[] => {
    return pairs.flatMap((pair, index) => {
      const toToken = tokenRoute[index + 1];
      const amountOutMin = new BigNumber(intermediaryAmounts[index + 1])
        .multipliedBy(1 - slippage / pairs.length / 100)
        .toFixed(0);
      return [
        new AddressValue(new Address(pair.address)),
        BytesValue.fromUTF8('swapTokensFixedInput'),
        BytesValue.fromUTF8(toToken),
        new BigUIntValue(BigInt(amountOutMin)),
      ];
    });
  };

  const createTransaction = (sender: string, receiver: IAddress, payload: string, gasLimit: number) => {
    return new Transaction({
      sender: new Address(sender),
      receiver: receiver,
      data: new TransactionPayload(payload),
      gasLimit: gasLimit,
      value: 0,
      chainID: chainId,
    });
  };

  const sendTransaction = async (transaction: Transaction) => {
    const props: SendTransactionsPropsType = {
      transactions: [transaction],
      transactionsDisplayInfo: {
        successMessage: 'Swap transaction successful',
        submittedMessage: 'Transaction submitted',
        processingMessage: 'Processing transaction',
        errorMessage: 'Transaction error',
        transactionDuration: 1000,
      },
      signWithoutSending: false,
      redirectAfterSign: false,
    };

    await sendTransactions(props);
  };

  const performSwapTokensFixedInput = async (
    esdtTransferArguments: string,
    swapArguments: string,
    pairContract: SmartContract
  ) => {
    const swapFunctionHex = BytesValue.fromUTF8('swapTokensFixedInput').valueOf().toString('hex');
    const payload = `ESDTTransfer@${esdtTransferArguments}@${swapFunctionHex}@${swapArguments}`;
    const transaction = createTransaction(account.address, pairContract.getAddress(), payload, SINGLE_SWAP_GAS_FEE);
    await sendTransaction(transaction);
  };

  const performMultiPairSwap = async (
    esdtTransferArguments: string,
    multiPairSwapArguments: string,
    routerContract: SmartContract
  ) => {
    const multiPairSwapFunctionHex = BytesValue.fromUTF8('multiPairSwap').valueOf().toString('hex');
    const payload = `ESDTTransfer@${esdtTransferArguments}@${multiPairSwapFunctionHex}@${multiPairSwapArguments}`;
    const transaction = createTransaction(account.address, routerContract.getAddress(), payload, MULTI_PAIR_GAS_FEE);
    await sendTransaction(transaction);
  };

  const performSwap = async ({
    amountIn,
    selectedFromToken,
    selectedToToken,
    amountOutMin,
    pairAddress,
    pairs,
    tokenRoute,
    intermediaryAmounts,
    slippage,
  }: SwapTransactionParams) => {
    if (!pairAbiRegistry || !routerAbiRegistry) {
      console.error('ABI registries are not loaded');
      return;
    }

    try {
      const esdtTransferArgs = prepareEsdtTransferArgs(amountIn, selectedFromToken);
      const esdtTransferSerializer = new ArgSerializer();
      const { argumentsString: esdtTransferArguments } = esdtTransferSerializer.valuesToString(esdtTransferArgs);

      if (pairs.length === 1) {
        const pairContract = new SmartContract({
          address: new Address(pairAddress),
          abi: pairAbiRegistry,
        });

        const swapArgs = prepareSwapArgs(amountOutMin, selectedToToken);
        const swapSerializer = new ArgSerializer();
        const { argumentsString: swapArguments } = swapSerializer.valuesToString(swapArgs);

        await performSwapTokensFixedInput(esdtTransferArguments, swapArguments, pairContract);
      } else {
        const routerContract = new SmartContract({
          address: new Address(ROUTER_SC),
          abi: routerAbiRegistry,
        });

        const multiPairSwapArgs: TypedValue[] = prepareMultiPairSwapArgs(pairs, tokenRoute, intermediaryAmounts, slippage);
        const multiPairSwapSerializer = new ArgSerializer();
        const { argumentsString: multiPairSwapArguments } = multiPairSwapSerializer.valuesToString(multiPairSwapArgs);

        await performMultiPairSwap(esdtTransferArguments, multiPairSwapArguments, routerContract);
      }
    } catch (error) {
      console.error('Error performing swap:', error);
    }
  };

  return { performSwap };
};
