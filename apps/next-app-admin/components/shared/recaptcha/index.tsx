import ReCAPTCHA from 'react-google-recaptcha';
import env from 'utils/constants/env';

export default function Recaptcha({ onChange }): JSX.Element {
  return (
    <ReCAPTCHA
      badge="inline"
      sitekey={env.captchaKey}
      onChange={(value: boolean) => onChange(value)}
    />
  );
}
