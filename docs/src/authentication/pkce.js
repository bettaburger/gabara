const clientId = "105507cca7d448d7a4f7ce2108cc5f37";
const redirectUri = 'https://bettaburger.github.io/gabara/docs/callback.html';
const scope = 'user-read-private user-read-email';
const authUrl = new URL("https://accounts.spotify.com/authorize");

// code verifier, this function generates a cyptographic random string
const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

// code challenge, this function will hash the code verifier using the sha256 algorithm. This value will be sent inside the authorization request. 
const sha256 = async (plain) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return window.crypto.subtle.digest('SHA-256', data)
}

// return a base64 representation of the digest created in sha256 function
const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

// request user authorization via button click
document.getElementById("connectSpotify").addEventListener("click", async () => {
  const codeVerifier = generateRandomString(64);
  window.localStorage.setItem("code_verifier", codeVerifier);
  // generate the hashed code verifier and code challenge
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);
  // insert into param for the authorization url
  const params = {
    response_type: "code",
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  };
  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
});
