function toBase64Url(value) {
  return btoa(JSON.stringify(value)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function fromBase64Url(value) {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/');
  return JSON.parse(atob(normalized));
}

export function createFakeJwt(user) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000)
  };
  return `${toBase64Url(header)}.${toBase64Url(payload)}.firma-demo`;
}

export function decodeFakeJwt(token) {
  return fromBase64Url(token.split('.')[1]);
}
