const BASE_URL = "https://placement-records.onrender.com/api";

export async function initCaptcha() {
  const res = await fetch(`${BASE_URL}/captcha/init`, {
    method: "POST",
  });
  return res.json();
}

export async function fetchResult(payload) {
  const res = await fetch(`${BASE_URL}/result`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function checkStatus(requestId) {
  const res = await fetch(`${BASE_URL}/status/${requestId}`);
  return res.json();
}