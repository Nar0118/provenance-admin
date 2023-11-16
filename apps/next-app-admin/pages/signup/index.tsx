import AuthLayout from 'components/shared/authLayout';
import SignUp from 'components/feature/signup';

export default function SignUpPage(): JSX.Element {
  return (
    <AuthLayout>
      <SignUp />
    </AuthLayout>
  );
}
