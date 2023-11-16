import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { Form } from 'antd';
import notification from 'components/shared/notification';
import Input from 'components/shared/input';
import Button from 'components/shared/button';
import CheckBox from 'components/shared/checkbox';
import Recaptcha from 'components/shared/recaptcha';
import { AuthServiceContext } from 'utils/services/service/authService';

import styles from './login.module.scss';

export default function Login(): JSX.Element {
  const authService = useContext(AuthServiceContext);
  const router = useRouter();

  const [form] = Form.useForm();
  const [recaptchaIsSelected, setRecaptchaIsSelected] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onFinish = async (): Promise<void> => {
    const { email, password } = form.getFieldsValue();

    try {
      const res = await authService.login(email, password);
      if (res.success) {
        router.push('/');
      } else {
        setErrorMessage(res.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const isDisabled = (): boolean => {
    return (
      !form.isFieldsTouched(true) ||
      !!form.getFieldsError().filter(({ errors }) => errors.length).length ||
      !recaptchaIsSelected
    );
  };

  useEffect(() => {
    document.getElementById('__next').style.height = '100%';
  }, []);

  return (
    <div className={styles.loginFormContainer}>
      <div className={styles.loginHeader}>Log In</div>
      <Form form={form} initialValues={{ remember: true }} onFinish={onFinish}>
        <div className={styles.inputsContainer}>
          <Form.Item
            name="email"
            className={styles.formItem}
            rules={[
              {
                type: 'email',
                message: 'The input is not valid Email!',
              },
              { required: true, message: 'Please enter your email address.' },
            ]}
            required={true}
          >
            <Input type="email" label="Email" className={styles.formInput} />
          </Form.Item>
          {errorMessage && (
            <span className={styles.errorMessage}>{errorMessage}</span>
          )}
          <Form.Item
            name="password"
            className={styles.formItem}
            rules={[
              {
                message: 'The input is not valid password!',
              },
              { required: true, message: 'Please enter your password.' },
            ]}
            required={true}
          >
            <Input
              type="password"
              label="Password"
              className={styles.formInput}
            />
          </Form.Item>

          <div className={styles.forgotPassword}>
            <CheckBox text="Remember me" />
          </div>
          <div className={styles.recaptcha}>
            <Recaptcha onChange={setRecaptchaIsSelected} />
          </div>
        </div>
        <Form.Item shouldUpdate>
          {() => (
            <Button
              disabled={isDisabled()}
              text="Log In"
              htmlType="submit"
              className={styles.loginButton}
            />
          )}
        </Form.Item>
      </Form>
      <NextLink href={'/signup'}>Sign Up</NextLink>
    </div>
  );
}
