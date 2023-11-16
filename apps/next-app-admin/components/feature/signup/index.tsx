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

import styles from './signup.module.scss';

export default function SignUp(): JSX.Element {
  const authService = useContext(AuthServiceContext);
  const router = useRouter();

  const [form] = Form.useForm();
  const [recaptchaIsSelected, setRecaptchaIsSelected] = useState<boolean>(true);

  const onFinish = async (): Promise<void> => {
    const { email, password, address, name } = form.getFieldsValue();

    try {
      const res = await authService.signup(email, password, address, name);
      if (res.success) {
        router.push('/');
      } else {
        notification({
          messageType: 'error',
          message: 'Oops!',
          description: res?.error,
        });
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
    <div className={styles.signupFormContainer}>
      <div className={styles.signupHeader}>Sign Up</div>
      <Form form={form} initialValues={{ remember: true }} onFinish={onFinish}>
        <div className={styles.inputsContainer}>
          <Form.Item
            name="name"
            className={styles.formItem}
            rules={[
              {
                message: 'The input is not valid Name!',
              },
              { required: true, message: 'Please enter your Name.' },
            ]}
            required={true}
          >
            <Input type="name" label="Name" className={styles.formInput} />
          </Form.Item>
          <Form.Item
            name="address"
            className={styles.formItem}
            rules={[
              {
                message: 'The input is not valid Address!',
              },
              { required: true, message: 'Please enter your Address.' },
            ]}
            required={true}
          >
            <Input type="name" label="Address" className={styles.formInput} />
          </Form.Item>
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
              text="Sign Up"
              htmlType="submit"
              className={styles.signButton}
            />
          )}
        </Form.Item>
      </Form>
      <NextLink href={'/login'}>Log In</NextLink>
    </div>
  );
}
