import { FormInstance } from 'antd';

export const isDisabled = (formName: FormInstance<any>): boolean => {
  const values = Object.values(formName.getFieldsValue());
  values.map((value) => {
    if (!value && value !== false) {
      return true;
    }
  });

  return (
    !formName.isFieldsTouched(true) ||
    !!formName.getFieldsError().filter(({ errors }) => errors.length).length
  );
};
