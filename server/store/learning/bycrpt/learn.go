package main

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)
func main()  {
	password := "myStrongPass123🥷"

	hash, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		fmt.Println("something bad happend")
	}
	fmt.Println(string(hash))

	erre := bcrypt.CompareHashAndPassword(hash, []byte("kkdkdd"))
	if erre != nil{
		
		fmt.Println("Wrong password")
	}else {
		fmt.Println("Password correct ✅")
	}
}