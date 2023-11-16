import dayjs from 'dayjs';

export function validMail(mail: string): boolean {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    mail
  );
}

export const dateFormatter = (date: Date | string): string =>
  dayjs(date).format('YYYY-MM-DD');

export const handleValidation = (
  e: string,
  setPasswordErr: (value: string) => void,
  setPasswordSuccess: (value: boolean) => void
): void => {
  const passwordInputValue = e.trim();

  const uppercaseRegExp = /(?=.*?[A-Z])/;
  const lowercaseRegExp = /(?=.*?[a-z])/;
  const digitsRegExp = /(?=.*?[0-9])/;
  const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
  const minLengthRegExp = /.{8,}/;
  const passwordLength = passwordInputValue.length;
  const uppercasePassword = uppercaseRegExp.test(passwordInputValue);
  const lowercasePassword = lowercaseRegExp.test(passwordInputValue);
  const digitsPassword = digitsRegExp.test(passwordInputValue);
  const specialCharPassword = specialCharRegExp.test(passwordInputValue);
  const minLengthPassword = minLengthRegExp.test(passwordInputValue);

  if (passwordLength === 0) {
    setPasswordErr('Password is empty');
    setPasswordSuccess(false);
  } else if (!minLengthPassword) {
    setPasswordErr('At least minimum 8 characters');
    setPasswordSuccess(false);
  } else if (!uppercasePassword) {
    setPasswordErr('At least one Uppercase');
    setPasswordSuccess(false);
  } else if (!lowercasePassword) {
    setPasswordErr('At least one Lowercase');
    setPasswordSuccess(false);
  } else if (!digitsPassword) {
    setPasswordErr('At least one digit');
    setPasswordSuccess(false);
  } else if (!specialCharPassword) {
    setPasswordErr('At least one Special Characters');
    setPasswordSuccess(false);
  } else {
    setPasswordSuccess(true);
    setPasswordErr('');
  }
};

export const validator = (_, value): Promise<void> => {
  return !value.includes('  ') &&
    value[0] !== ' ' &&
    value[value.length - 1] != ' '
    ? Promise.resolve()
    : Promise.reject(new Error('Double spaces or form beginning  not allowed'));
};

export const validationMinAmount = (value): Promise<void> => {
  const digitsRegExp = /^\$?([1-9]{1}[0-9]{0,2}(\,[0-9]{3})*(\.[0-9]{0,2})?|[1-9]{1}[0-9]{0,}(\.[0-9]{0,2})?|0(\.[0-9]{0,6})?|(\.[0-9]{1,2})?)$/;
  const priceValidation = digitsRegExp.test(value);

  if (!priceValidation && value !== '') {
    return Promise.reject(new Error('Wrong number'));
  }
  if (value === '') {
    return Promise.reject(new Error('Please input FundingPool Min Amount'));
  }

  return Promise.resolve();
};
