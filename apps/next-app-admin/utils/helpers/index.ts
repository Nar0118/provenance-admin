import moment from 'moment';

export const acceptWarningModal = (
  setWarningModalVisibility: () => void,
  setModalVisibility: () => void
): void => {
  setWarningModalVisibility();
  const myTimeout = setTimeout(() => {
    setModalVisibility();
    clearTimeout(myTimeout);
  }, 100);
};

export const handelCancel = (
  defaultValue: object,
  selectedValue: object,
  UpdateModalVisibility: () => void,
  WarningModalVisibility: () => void
): void => {
  const formChanged =
    JSON.stringify(defaultValue) === JSON.stringify(selectedValue);
  formChanged ? UpdateModalVisibility() : WarningModalVisibility();
};

export const dateFormatter = (date: Date | string): string =>
  moment(date).format('YYYY-MM-DD hh:mm');
