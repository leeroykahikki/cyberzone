import cookie from 'cookie';

// Метод для получения куки
export function parseCookies(req) {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie);
}
