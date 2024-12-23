package models

import (
	"api/db"
	"api/utils"
	"errors"
	"fmt"
)

type User struct {
	ID       			int    `json:"id"`
	Username 			string `json:"username"`
	Email    			string `json:"email" binding:"required"`
	Password 			string `json:"password" binding:"required"`
	Name		 			string `json:"name"`
	Surname  			string `json:"surname"`
	DateOfBirth 	string `json:"dateOfBirth"`
}

func (u *User) Save() error {
	query := "INSERT INTO users (login, password, email, name, surname, date_of_birth, createdat, updatedat, isadmin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id"
	stmt, err := db.DB.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()

	pass, err := utils.HashPassword(u.Password)

	if err != nil {
		return err
	}

	_, err = stmt.Exec(u.Username, pass, u.Email, u.Name, u.Surname, "now()", "now()", "now()", false)

	if err != nil {
		fmt.Println(err)
		return err
	}

	return err
}

func GetUsernameById(id int) (string, error) {
	query := "SELECT login FROM users WHERE id = $1"
	row := db.DB.QueryRow(query, id)

	var userId string

	err := row.Scan(&userId)

	if err != nil {
		return "", err
	}

	return userId, nil
}

func (u *User) Authenticate() (int,error) {
	query := " SELECT id, login, password FROM users WHERE email = $1"
	row := db.DB.QueryRow(query, u.Email)

	var retrievedPassword string
	err := row.Scan(&u.ID, &u.Username, &retrievedPassword)

	if err != nil {
		return 0, errors.New("invalid credentials")
	}

	passwordIsValid := utils.CheckPasswordHash(u.Password, retrievedPassword)

	if !passwordIsValid {
		return 0, errors.New("invalid credentials")
	}

	return u.ID, nil
}

func (u *User) ChangePassword( password string) error {
	query := "UPDATE users SET password = $1 WHERE id = $2"
	stmt, err := db.DB.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()

	pass, err := utils.HashPassword(password)

	if err != nil {
		return err
	}

	_, err = stmt.Exec(pass, u.ID)

	return err
}