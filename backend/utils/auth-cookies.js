/**
 * Unified Cookie Utility for Express
 * Sets secure HttpOnly cookies for authentication
 */

function setAuthCookie(res, name, token) {
  const isProd = process.env.NODE_ENV === 'production';
  
  res.cookie(name, token, {
    httpOnly: true,
    secure: isProd, // Must be true for SameSite: 'None'
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days in ms
    path: '/',
  });
}

function removeAuthCookie(res, name) {
  const isProd = process.env.NODE_ENV === 'production';
  
  res.cookie(name, '', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 0,
    path: '/',
  });
}

module.exports = { setAuthCookie, removeAuthCookie };
