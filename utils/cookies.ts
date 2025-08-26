"use client";

export function setCookie(name: string, value: string, days: number = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function setAuthTokens(accessToken: string, refreshToken: string) {
  setCookie('access_token', accessToken, 1); // 1 day
  setCookie('refresh_token', refreshToken, 7); // 7 days
}

export function getAuthTokens() {
  return {
    accessToken: getCookie('access_token'),
    refreshToken: getCookie('refresh_token'),
  };
}

export function clearAuthTokens() {
  deleteCookie('access_token');
  deleteCookie('refresh_token');
}