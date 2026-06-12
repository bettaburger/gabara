package main

import (
	"log"
	"net/http"
	"time"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/bettaburger/gabara/internal/authenticate/pkce"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("FAILED TO LOAD .env:", err)
	}
	r := mux.NewRouter()
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {http.ServeFile(w, r, "web/app/pages/login.html")}) // make this handle dynamic after login
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	r.PathPrefix("/web/").Handler(http.StripPrefix("/web/", http.FileServer(http.Dir("web/app"))))
	//r.PathPrefix("/callback/").Handler(http.StripPrefix("/callback/", http.FileServer(http.Dir("callback"))))
	srv := &http.Server{
		Handler:      r,
  	Addr:         "127.0.0.1:8000",
  	WriteTimeout: 15 * time.Minute,
    ReadTimeout:  15 * time.Minute,
  }
	pkce.NewAuth()

	log.Println("index.html running on http://localhost:8000/web/")
	log.Println("login page running on http://localhost:8000/")
  log.Fatal(srv.ListenAndServe())
}