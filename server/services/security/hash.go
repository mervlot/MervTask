package security

import "golang.org/x/crypto/bcrypt"


func HashPassword (password string, cost int) (string, error){
	hash, err := bcrypt.GenerateFromPassword([]byte(password), cost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}