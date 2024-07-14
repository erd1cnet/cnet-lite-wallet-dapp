import { useFormik } from 'formik';
import * as Yup from 'yup';
import { prepareTransaction, sendTransactions, useGetAccountInfo, useGetNetworkConfig } from 'lib'; // Adjust import paths accordingly

export const useWrapForm = (balance: number, closeModal: () => void) => {
  const { account } = useGetAccountInfo();
  const { chainID } = useGetNetworkConfig();

  const formik = useFormik({
    initialValues: {
      amount: '',
      sliderValue: 0,
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .required('Amount is required')
        .min(0, 'Amount must be greater than or equal to 0')
        .max(balance, `Amount must be less than or equal to ${balance}`),
      sliderValue: Yup.number()
        .min(0)
        .max(100),
    }),
    onSubmit: async (values) => {
      if (Number(values.amount) === 0) {
        formik.setFieldError('amount', 'Amount must be greater than 0');
        return;
      }

      const transaction = prepareTransaction({
        receiver: 'erd1qqqqqqqqqqqqqpgqjpyeg6exfa934qdxp2w8cdqrgzun28ye74nstqaxnr',
        amount: values.amount,
        gasLimit: '2000000',
        data: 'wrapCnet',
        balance: account.balance,
        sender: account.address,
        gasPrice: '1000000000', // You can adjust the gas price as needed
        nonce: account.nonce,
        chainId: chainID,
      });

      const transactionObject = {
        transactions: [transaction],
        signWithoutSending: false,
        transactionsDisplayInfo: {
          processingMessage: 'Processing transaction...',
          errorMessage: 'Transaction failed',
          successMessage: 'Transaction successful',
        },
      };

      await sendTransactions(transactionObject);

      formik.resetForm();
      if (closeModal) {
        closeModal();
      }
    },
  });

  return formik;
};
