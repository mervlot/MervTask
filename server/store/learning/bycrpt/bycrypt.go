package main

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

func f() {
	password := "myStrongPass123🥷"

	// Hash password
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}
	fmt.Println("Hashed:", string(hashed))

	// Verify correct password
	err = bcrypt.CompareHashAndPassword(hashed, []byte(password))
	if err != nil {
		fmt.Println("Wrong password")
	} else {
		fmt.Println("Password correct ✅")
	}

	// Verify wrong password
	err = bcrypt.CompareHashAndPassword(hashed, []byte("wrongpass"))
	if err != nil {
		fmt.Println("Wrong password ❌")
	}
}
