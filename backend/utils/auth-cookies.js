/**
 * Unified Cookie Utility for Express
 * Sets secure HttpOnly cookies for authentication
 */

function setAuthCookie(res, name, token) {
  const isProd = process.env.NODE_ENV === 'production';
  const secure = isProd ? 'Secure;' : '';
  const sameSite = isProd ? 'None' : 'Lax';
  
  const cookieString = `${name}=${token}; HttpOnly; ${secure} SameSite=${sameSite}; Max-Age=${60 * 60 * 24 * 7}; Path=/`;
  
  let existingCookies = res.getHeader('Set-Cookie') || [];
  if (!Array.isArray(existingCookies)) existingCookies = [existingCookies];
  
  res.setHeader('Set-Cookie', [...existingCookies, cookieString]);
}

function removeAuthCookie(res, name) {
  const isProd = process.env.NODE_ENV === 'production';
  const secure = isProd ? 'Secure;' : '';
  const sameSite = isProd ? 'None' : 'Lax';

  const cookieString = `${name}=; HttpOnly; ${secure} SameSite=${sameSite}; Max-Age=0; Path=/`;
  
  let existingCookies = res.getHeader('Set-Cookie') || [];
  if (!Array.isArray(existingCookies)) existingCookies = [existingCookies];
  
  res.setHeader('Set-Cookie', [...existingCookies, cookieString]);
}

module.exports = { setAuthCookie, removeAuthCookie };
