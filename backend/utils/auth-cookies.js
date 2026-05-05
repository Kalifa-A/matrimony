/**
 * Unified Cookie Utility for Express
 * Sets secure HttpOnly cookies for authentication
 */

function setAuthCookie(res, name, token) {
  const secure = process.env.NODE_ENV === 'production' ? 'Secure;' : '';
  const cookieString = `${name}=${token}; HttpOnly; ${secure} SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}; Path=/`;
  
  // Support existing cookies if any
  let existingCookies = res.getHeader('Set-Cookie') || [];
  if (!Array.isArray(existingCookies)) existingCookies = [existingCookies];
  
  res.setHeader('Set-Cookie', [...existingCookies, cookieString]);
}

function removeAuthCookie(res, name) {
  const secure = process.env.NODE_ENV === 'production' ? 'Secure;' : '';
  const cookieString = `${name}=; HttpOnly; ${secure} SameSite=Lax; Max-Age=0; Path=/`;
  
  let existingCookies = res.getHeader('Set-Cookie') || [];
  if (!Array.isArray(existingCookies)) existingCookies = [existingCookies];
  
  res.setHeader('Set-Cookie', [...existingCookies, cookieString]);
}

module.exports = { setAuthCookie, removeAuthCookie };
