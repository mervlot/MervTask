 package store

// import (
// 	"fmt"
// 	"mervtask/types"
// 	"time"

// 	"github.com/golang-jwt/jwt/v5"
// )

// var jwtSecret = []byte("secret")

// func SignJWT(userid int, username string) (string, error) {
// 	expirationTime := time.Now().Add(15 * time.Minute)
// 	claims := types.Refersh{
// 		UserID:    userid,
// 		UserName: username,
// 		RegisteredClaims: jwt.RegisteredClaims{
// 			ExpiresAt: jwt.NewNumericDate(expirationTime),
// 			IssuedAt:  jwt.NewNumericDate(time.Now()),
// 			Issuer:    "MervID",
// 		},
// 	}
// 	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
// 	tokenString, err := token.SignedString(jwtSecret)
// 	if err != nil {
// 		return "", fmt.Errorf("could not sign the token: %w", err)
// 	}
// 	return tokenString, nil
// }


// func VerifyToken(tokenString string) (*types.Refersh, error){


// 	claims := &types.Refersh{}
// 	token,err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {


// 		if _,ok :=token.Method.(*jwt.SigningMethodHMAC); !ok{
// 			return nil, fmt.Errorf("unexpeccted signing method: %v", token.Header["alg"])
// 		}
// 		return jwtSecret, nil
// 	})
// 	if err != nil{
// 		return nil, err
// 	}
// 	token.
// 	if !token.Valid {
// 		return nil, fmt.Errorf("invaliid token")
// 	}
// 	return claims, nil
// }
