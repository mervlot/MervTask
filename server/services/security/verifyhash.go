package security

import "golang.org/x/crypto/bcrypt"

func VerifyHashPassword (hash string, password string) error {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	if err != nil {
		return err
	}
	return nil

}