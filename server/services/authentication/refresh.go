package authentication

import (
	"fmt"
	"mervtask/types"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var refreshSecret = []byte(os.Getenv("REFRESH_SECRET"))

func RefreshToken(userid int, username string) (string, error) {

	expirationTime := time.Now().Add(30 * 24 * time.Hour)
	claims := types.Refersh{
		UserID:   userid,
		UserName: username,
		RegisteredClaims: jwt.RegisteredClaims{
			Audience:  []string{"MervApps"},
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "MervID",
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(refreshSecret)
	if err != nil {
		return "", fmt.Errorf("could not sign the token: %w", err)
	}
	return tokenString, nil

}
