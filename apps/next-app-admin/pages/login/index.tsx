import AuthLayout from 'components/shared/authLayout';
import Login from 'components/feature/login';

export default function LoginPage(): JSX.Element {
  return (
    <AuthLayout>
      <Login />
    </AuthLayout>
  );
}
