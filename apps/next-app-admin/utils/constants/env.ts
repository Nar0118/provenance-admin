export interface EnvVariables {
    captchaKey: string;
    nextPublicApiBaseUrl: string;
};

const env: EnvVariables = {
    nextPublicApiBaseUrl:
        process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8746',
    captchaKey:
        process.env.NEXT_PUBLIC_RE_CAPTCHA_KEY ??
        '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
};

export default env;
