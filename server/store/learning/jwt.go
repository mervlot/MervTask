package main

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type payload struct {
	Name  string
	Email string

	jwt.RegisteredClaims
}

func jwtmain() {
	jwtsrt := []byte("please follow me 🥺")
	expr := time.Now().Add(15 * time.Second)

	claims := payload{
		Name:  "Muhammad",
		Email: "princeadeite09@gmail.com",
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "Mervlot",
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(expr),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtsrt)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(tokenString)

	extractedClaimes := &payload{}
	_, erre := jwt.ParseWithClaims(tokenString, extractedClaimes, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpeccted signing method: %v", token.Header["alg"])
		}
		return jwtsrt, nil
	})
	if erre != nil {
		fmt.Println("sorry")
	}
	// fmt.Println(tokendata.Raw)
	// fmt.Println("name",extractedClaimes.Name)

}
