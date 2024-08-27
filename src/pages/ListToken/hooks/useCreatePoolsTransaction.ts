import { useEffect, useState } from 'react';
import {
  AbiRegistry,
  SmartContract,
  Address,
  BigUIntValue,
  BytesValue,
  ArgSerializer,
  TypedValue,
  AddressValue,
  IAddress,
  Transaction,
  TransactionPayload,
} from "@multiversx/sdk-core";
import { sendTransactions, useGetAccountInfo, useGetNetworkConfig, useGetSignedTransactions } from 'lib';
import {
  ROUTER_SC,
  CREATE_PAIR_GAS_FEE,
  ISSUE_LP_TOKEN_GAS_FEE,
  SET_LOCAL_ROLES_GAS_FEE,
  ADD_INITIAL_LIQUIDITY_GAS_FEE,
  SET_SWAP_ENABLED_GAS_FEE
} from 'config';
import routerAbi from 'abis/router.abi.json';
import pairAbi from 'abis/pair.abi.json';

export const useCreatePoolsTransaction = () => {
  const { account } = useGetAccountInfo();
  const { network: { chainId } } = useGetNetworkConfig();
  const { signedTransactions } = useGetSignedTransactions();

  const [routerAbiRegistry, setRouterAbiRegistry] = useState<AbiRegistry | null>(null);
  const [pairAbiRegistry, setPairAbiRegistry] = useState<AbiRegistry | null>(null);

  useEffect(() => {
    const loadAbi = async () => {
      try {
        const routerRegistry = AbiRegistry.create(routerAbi);
        const pairRegistry = AbiRegistry.create(pairAbi);
        setRouterAbiRegistry(routerRegistry);
        setPairAbiRegistry(pairRegistry);
      } catch (error) {
        console.error('Error loading ABI:', error);
        alert('Error loading ABI files. Please check your network connection or ABI file paths.');
      }
    };
    loadAbi();
  }, []);

  const createTransaction = (sender: string, receiver: IAddress, payload: string, gasLimit: number, value: number = 0) => {
    return new Transaction({
      sender: new Address(sender),
      receiver: receiver,
      data: new TransactionPayload(payload),
      gasLimit: gasLimit,
      value: value,
      chainID: chainId,
    });
  };

  const sendTransaction = async (transaction: Transaction): Promise<string | null> => {
    try {
      const props = {
        transactions: [transaction],
        transactionsDisplayInfo: {
          successMessage: 'Transaction successful',
          submittedMessage: 'Transaction submitted',
          processingMessage: 'Processing transaction',
          errorMessage: 'Transaction error',
          transactionDuration: 1000,
        },
        signWithoutSending: false,
        redirectAfterSign: false,
      };

      const { sessionId, error } = await sendTransactions(props);

      if (error){
        console.log("error:",error);
      }

      const transactionHashes = signedTransactions[sessionId]?.transactions?.map((transactions: any) => new Transaction(transactions).getHash().hex());
      const transactionHash = transactionHashes ? transactionHashes[0] : null;
      console.log("transactionHash:", transactionHash);
      return transactionHash;
    } catch (error) {
      console.error('Error sending transaction:', error);
      alert('Error sending transaction. Please check your network connection or transaction details.');
      return null;
    }
  };

  const createPair = async ({
    firstTokenId,
    secondTokenId,
    optFeePercents,
    admins,
  }: {
    firstTokenId: string;
    secondTokenId: string;
    optFeePercents?: [number, number];
    admins?: string[];
  }) => {
    if (!routerAbiRegistry) {
      console.error('Router ABI registry is not loaded');
      return null;
    }

    try {
      const routerContract = new SmartContract({
        address: new Address(ROUTER_SC),
        abi: routerAbiRegistry,
      });

      const createPairArgs: TypedValue[] = [
        BytesValue.fromUTF8(firstTokenId),
        BytesValue.fromUTF8(secondTokenId),
        new AddressValue(new Address(account.address)),
      ];

      if (optFeePercents) {
        createPairArgs.push(...optFeePercents.map(fee => new BigUIntValue(BigInt(fee))));
      }

      if (admins) {
        createPairArgs.push(...admins.map(admin => new AddressValue(new Address(admin))));
      }

      const createPairSerializer = new ArgSerializer();
      const { argumentsString } = createPairSerializer.valuesToString(createPairArgs);

      const payload = `createPair@${argumentsString}`;
      const transaction = createTransaction(account.address, routerContract.getAddress(), payload, CREATE_PAIR_GAS_FEE);
      const transactionHash = await sendTransaction(transaction);

      return transactionHash;
    } catch (error) {
      console.error('Error creating pair:', error);
      alert('Error creating pair. Please check your network connection or contract details.');
      return null;
    }
  };

  const issueLpToken = async (pairAddress: string, firstTokenTicker: string, secondTokenTicker: string) => {
    if (!routerAbiRegistry) {
      console.error('Router ABI registry is not loaded');
      return null;
    }

    try {
      const routerContract = new SmartContract({
        address: new Address(ROUTER_SC),
        abi: routerAbiRegistry,
      });

      const lpTokenDisplayName = `${firstTokenTicker}${secondTokenTicker}`.toUpperCase();
      const lpTokenTicker = `${firstTokenTicker}${secondTokenTicker}LP`.toUpperCase();

      const issueLpTokenArgs: TypedValue[] = [
        new AddressValue(new Address(pairAddress)),
        BytesValue.fromUTF8(lpTokenDisplayName),
        BytesValue.fromUTF8(lpTokenTicker),
      ];

      const issueLpTokenSerializer = new ArgSerializer();
      const { argumentsString } = issueLpTokenSerializer.valuesToString(issueLpTokenArgs);

      const payload = `issueLpToken@${argumentsString}`;
      const valueInEGLD = 0.05 * Math.pow(10, 18);
      const transaction = createTransaction(account.address, routerContract.getAddress(), payload, ISSUE_LP_TOKEN_GAS_FEE, valueInEGLD);
      const transactionHash = await sendTransaction(transaction);

      return transactionHash;
    } catch (error) {
      console.error('Error issuing LP token:', error);
      alert('Error issuing LP token. Please check your network connection or transaction details.');
      return null;
    }
  };

  const setLocalRoles = async (pairAddress: string) => {
    if (!routerAbiRegistry) {
      console.error('Router ABI registry is not loaded');
      return null;
    }

    try {
      const routerContract = new SmartContract({
        address: new Address(ROUTER_SC),
        abi: routerAbiRegistry,
      });

      const setLocalRolesArgs: TypedValue[] = [
        new AddressValue(new Address(pairAddress)),
      ];

      const setLocalRolesSerializer = new ArgSerializer();
      const { argumentsString } = setLocalRolesSerializer.valuesToString(setLocalRolesArgs);

      const payload = `setLocalRoles@${argumentsString}`;
      const transaction = createTransaction(account.address, routerContract.getAddress(), payload, SET_LOCAL_ROLES_GAS_FEE);
      const transactionHash = await sendTransaction(transaction);

      return transactionHash;
    } catch (error) {
      console.error('Error setting local roles:', error);
      alert('Error setting local roles. Please check your network connection or transaction details.');
      return null;
    }
  };

  const addInitialLiquidity = async (
    pairAddress: string,
    firstTokenId: string,
    firstTokenAmount: string,
    secondTokenId: string,
    secondTokenAmount: string,
  ) => {
    if (!pairAbiRegistry) {
      console.error('Pair ABI registry is not loaded');
      return null;
    }

    try {
      const pairContract = new SmartContract({
        address: new Address(pairAddress),
        abi: pairAbiRegistry,
      });

      const addLiquidityArgs: TypedValue[] = [
        new AddressValue(new Address(pairAddress)),
        BytesValue.fromUTF8(firstTokenId),
        new BigUIntValue(BigInt(firstTokenAmount)),
        BytesValue.fromUTF8(secondTokenId),
        new BigUIntValue(BigInt(secondTokenAmount)),
      ];

      const addLiquiditySerializer = new ArgSerializer();
      const { argumentsString } = addLiquiditySerializer.valuesToString(addLiquidityArgs);

      const payload = `MultiESDTNFTTransfer@${pairAddress}@02@${firstTokenId}@00@${firstTokenAmount}@${secondTokenId}@00@${secondTokenAmount}@addInitialLiquidity@${argumentsString}`;
      const transaction = createTransaction(account.address, pairContract.getAddress(), payload, ADD_INITIAL_LIQUIDITY_GAS_FEE);
      const transactionHash = await sendTransaction(transaction);

      return transactionHash;
    } catch (error) {
      console.error('Error adding initial liquidity:', error);
      alert('Error adding initial liquidity. Please check your network connection or transaction details.');
      return null;
    }
  };

  const setSwapEnabledByUser = async (pairAddress: string) => {
    if (!routerAbiRegistry) {
      console.error('Router ABI registry is not loaded');
      return null;
    }

    try {
      const routerContract = new SmartContract({
        address: new Address(ROUTER_SC),
        abi: routerAbiRegistry,
      });

      const setSwapEnabledArgs: TypedValue[] = [
        new AddressValue(new Address(pairAddress)),
      ];

      const setSwapEnabledSerializer = new ArgSerializer();
      const { argumentsString } = setSwapEnabledSerializer.valuesToString(setSwapEnabledArgs);

      const payload = `setSwapEnabledByUser@${argumentsString}`;
      const transaction = createTransaction(account.address, routerContract.getAddress(), payload, SET_SWAP_ENABLED_GAS_FEE);
      const transactionHash = await sendTransaction(transaction);

      return transactionHash;
    } catch (error) {
      console.error('Error enabling swap by user:', error);
      alert('Error enabling swap by user. Please check your network connection or transaction details.');
      return null;
    }
  };

  return { createPair, issueLpToken, setLocalRoles, addInitialLiquidity, setSwapEnabledByUser };
};
