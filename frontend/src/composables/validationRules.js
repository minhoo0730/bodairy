export const emailRequiredRule = [
  v => !!v || 'E-mail은 필수입니다.',
  v =>
    /^[a-zA-Z0-9\s!@#$%^&*(),.?":{}|<>_-]+$/.test(v) ||
    '한글은 입력할 수 없습니다.',
  v =>
    /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(v) ||
    'E-mail 형식이 올바르지 않습니다.',
];

export const nameRequiredRule = [v => !!v || '이름은 필수입니다.'];

export const otpNumberRequiredRule = [
  v => !!v || '인증번호는 필수입니다.',
  v => /^[0-9]{6}$/.test(v) || '6자리 숫자 인증번호를 입력하세요.',
];

export const emailRule = [
  v =>
    /^[a-zA-Z0-9\s!@#$%^&*(),.?":{}|<>_-]+$/.test(v) ||
    '한글은 입력할 수 없습니다.',
  v =>
    /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(v) ||
    'E-mail 형식이 올바르지 않습니다.',
];

export const passwordRule = [
  v => !!v || '패스워드는 필수 입력사항입니다.',
  v =>
    (v && v.length >= 8 && v.length <= 30) ||
    '패스워드는 8~30자 이내로 입력해야 합니다.',
  v =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@!%*#?&])[A-Za-z\d$@!%*#?&]{9,30}$/.test(
      v,
    ) || '패스워드는 영문+숫자+특수문자를 포함해야 합니다.',
];


export const confirmPasswordRule = password => [
  v => !!v || '비밀번호 확인은 필수입니다.',
  v => v === password || '비밀번호가 일치하지 않습니다.',
];

export const requiredRule = val => {
  return !!val || '필수 입력항목 입니다.';
};

export const checkRule = (rules, value) => {
  if (!Array.isArray(rules)) {
    return { valid: true, message: '' }; // 규칙 없음 = 통과
  }

  for (const rule of rules) {
    const result = rule(value);
    if (result !== true) {
      return { valid: false, message: result };
    }
  }
  return { valid: true, message: '' };
};