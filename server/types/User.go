package types

import "time"

type Person struct {
	ID          int
	UserName    string
	FirstName   string
	LastName    string
	Age         int
	Email       string
	DateOfBirth time.Time
	Password string
}
type User struct {
	UserName    string `json:"user_name" binding:"required,alphanum,min=3,max=20"` // alphanumeric, 3-20 chars
	FirstName   string `json:"first_name" binding:"required,alpha,min=2,max=50"`   // only letters, 2-50 chars
	LastName    string `json:"last_name" binding:"required,alpha,min=2,max=50"`
	Age         int    `json:"age" binding:"required,gte=0,lte=120"`                 // 0-120
	Email       string `json:"email" binding:"required,email"`                       // valid email format
	DateOfBirth string `json:"date_of_birth" binding:"required,datetime=2006-01-02"` // format: YYYY-MM-DD
	Password    string `json:"password" binding:"required,min=8,max=64"`             // 8-64 chars
}