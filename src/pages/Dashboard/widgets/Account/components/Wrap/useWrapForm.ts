import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  prepareTransaction,
  sendTransactions,
  useGetAccountInfo,
  useGetNetworkConfig
} from 'lib'; // Adjust import paths accordingly
import { WRAP_SC } from 'config';

export const useWrapForm = (balance: number, closeModal: () => void) => {
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
      if (Number(values.amount) === 0) {
        formik.setFieldError('amount', 'Amount must be greater than 0');
        return;
      }

      const transaction = prepareTransaction({
        receiver: WRAP_SC,
        amount: values.amount,
        gasLimit: '2000000',
        data: 'wrapCnet',
        balance: account.balance,
        sender: account.address,
        gasPrice: '1000000000', 
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
