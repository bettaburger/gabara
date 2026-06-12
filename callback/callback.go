package callback

import (
	"net/http"
)

func callbackHandler(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("pkce_verifier")
	if err != nil {
		http.Error(w, "missing verifier", http.StatusBadRequest)
		return
	}
	codeVerifier := cookie.Value
	_ = codeVerifier // use in token exchange
}