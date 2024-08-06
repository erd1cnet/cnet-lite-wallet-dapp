import { useEffect, useState } from 'react';
import { AbiRegistry, SmartContract, Address, BigUIntValue, BytesValue, ArgSerializer } from "@multiversx/sdk-core";
import { sendTransactions, useGetAccountInfo } from 'lib';
import { Transaction, TransactionPayload } from "@multiversx/sdk-core";
import { SwapTransactionParams } from '../types';
import { SendTransactionsPropsType } from 'types';

import BigNumber from 'bignumber.js';
import pairAbi from '../../../abis/pair.abi.json';

export const useSwapTransaction = () => {
  const { account } = useGetAccountInfo();
  const [pairAbiRegistry, setPairAbiRegistry] = useState<AbiRegistry | null>(null);

  useEffect(() => {
    const loadAbi = async () => {
      try {
        const registry = AbiRegistry.create(pairAbi);
        setPairAbiRegistry(registry);
      } catch (error) {
        console.error('Error loading ABI:', error);
      }
    };

    loadAbi();
  }, []);

  const performSwap = async ({
    amountIn,
    selectedFromToken,
    selectedToToken,
    amountOutMin,
    pairAddress,
  }: SwapTransactionParams) => {
    if (!pairAbiRegistry) {
      console.error('Pair ABI registry is not loaded');
      return;
    }

    try {
      const pairContract = new SmartContract({
        address: new Address(pairAddress),
        abi: pairAbiRegistry
      });

      console.log(amountOutMin);
      console.log((new BigNumber(amountOutMin).times(new BigNumber(10).pow(selectedFromToken.decimals))).toString());
      const amountInBigInt = BigInt(new BigNumber(amountIn).times(new BigNumber(10).pow(selectedFromToken.decimals)).toFixed());
      console.log(amountInBigInt);
      const amountOutMinBigInt = BigInt(new BigNumber(amountOutMin).times(new BigNumber(10).pow(selectedToToken.decimals)).toFixed());
      console.log(amountOutMinBigInt);

      const esdtTransferArgs = [
        new BytesValue(Buffer.from(selectedFromToken.identifier, 'utf-8')),
        new BigUIntValue(amountInBigInt)
      ];

      const esdtTransferSerializer = new ArgSerializer();
      const { argumentsString: esdtTransferArguments } = esdtTransferSerializer.valuesToString(esdtTransferArgs);

      const swapArgs = [
        new BytesValue(Buffer.from(selectedToToken.identifier, 'utf-8')),
        new BigUIntValue(amountOutMinBigInt)
      ];

      const swapSerializer = new ArgSerializer();
      const { argumentsString: swapArguments } = swapSerializer.valuesToString(swapArgs);

      const swapFunctionHex = new BytesValue(Buffer.from('swapTokensFixedInput', 'utf-8')).valueOf().toString('hex');

      const payload = `ESDTTransfer@${esdtTransferArguments}@${swapFunctionHex}@${swapArguments}`;

      console.log('Creating transaction...');
      const transaction = new Transaction({
        sender: new Address(account.address),
        receiver: pairContract.getAddress(),
        data: new TransactionPayload(payload),
        gasLimit: 30000000,
        value: 0,
        chainID: '55',
      });

      console.log('Sending transaction...');
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
    } catch (error) {
      console.error('Error performing swap:', error);
    }
  };

  return { performSwap };
};
