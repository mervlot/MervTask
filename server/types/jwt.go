package types

import "github.com/golang-jwt/jwt/v5"

type Refersh struct {
	UserID   int    `json:"userid"`
	UserName string `json:"username"`
	jwt.RegisteredClaims
}
type Access struct {
	UserID   int    `json:"userid"`
	UserName string `json:"username"`
	Email string `json:"email"`
	Age int `json:"age"`
	jwt.RegisteredClaims
}
