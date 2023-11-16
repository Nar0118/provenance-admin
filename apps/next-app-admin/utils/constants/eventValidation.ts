import { FormInstance } from 'antd';

export const isDisabled = (formName: FormInstance<any>): boolean => {
  const fieldsValue = formName.getFieldsValue();
  const values = Object.values(fieldsValue);
  const keys = Object.keys(fieldsValue);
  values.map((value) => {
    if (!value && value !== false) {
      return true;
    }
  });

  let invalidFieldss = false;
  keys.map((value) => {
    if (value !== 'details' && fieldsValue[value] === undefined) {
      return (invalidFieldss = true);
    }
  });

  return (
    invalidFieldss ||
    !!formName.getFieldsError().filter(({ errors }) => errors.length).length
  );
};
