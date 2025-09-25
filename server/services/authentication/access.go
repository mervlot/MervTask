package authentication

import (
	"fmt"
	"mervtask/types"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func AccessToken(userid int, username string, email string, age int) (string, error) {

	expirationTime := time.Now().Add(24 * time.Hour)
	claims := types.Access{
		UserID:   userid,
		UserName: username,
		Email:    email,
		Age:      age,
		RegisteredClaims: jwt.RegisteredClaims{
			Audience:  []string{"MervApps"},
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "MervID",
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(accessSecret)
	if err != nil {
		return "", fmt.Errorf("could not sign the token: %w", err)
	}
	return tokenString, nil

}
