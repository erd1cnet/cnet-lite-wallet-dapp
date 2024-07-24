import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  prepareTransaction,
  sendTransactions,
  useGetAccountInfo,
  useGetNetworkConfig
} from 'lib'; // Adjust import paths accordingly

const stringToHex = (str: string) => {
  return Buffer.from(str, 'utf8').toString('hex');
};

const toHex = (value: BigNumber | string | number) => {
  let hexValue = new BigNumber(value).toString(16);
  if (hexValue.length % 2 !== 0) {
    hexValue = `0${hexValue}`;
  }
  return hexValue;
};

export const useUnwrapForm = (balance: number, closeModal: () => void) => {
  const { account } = useGetAccountInfo();
  const {
    network: { chainId }
  } = useGetNetworkConfig();

  const formik = useFormik({
    initialValues: {
      amount: '',
      sliderValue: 0
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .required('Amount is required')
        .min(0, 'Amount must be greater than or equal to 0')
        .max(balance, `Amount must be less than or equal to ${balance}`),
      sliderValue: Yup.number().min(0).max(100)
    }),
    onSubmit: async (values) => {
      if (new BigNumber(values.amount).isZero()) {
        alert('Amount must be greater than 0');
        return;
      }

      const amountInWei = toHex(
        new BigNumber(values.amount).multipliedBy(1e18)
      ); // Convert amount to hexadecimal
      const dataField = `ESDTTransfer@${stringToHex(
        'WCNET-2200e8'
      )}@${amountInWei}@${stringToHex('unwrapCnet')}`;

      const transaction = prepareTransaction({
        receiver: 'erd1qqqqqqqqqqqqqpgqm03h5ueactsrgrsu965hn8ljeq68fxzt74nspyjsw9', // Typically, token unwrap transactions send to the sender's address
        amount: '0', // Token transfer amount is specified in the data field, so this should be 0
        gasLimit: '2000000',
        data: dataField,
        balance: '0', // Since it's a token transfer, balance should be 0
        sender: account.address,
        gasPrice: '1000000000', // Adjust the gas price as needed
        nonce: account.nonce,
        chainId
      });

      const transactionObject = {
        transactions: [transaction],
        signWithoutSending: false,
        transactionsDisplayInfo: {
          processingMessage: 'Processing transaction...',
          errorMessage: 'Transaction failed',
          successMessage: 'Transaction successful'
        }
      };

      await sendTransactions(transactionObject);

      formik.resetForm();
      if (closeModal) {
        closeModal();
      }
    }
  });

  return formik;
};
