package routes

import (
	"api/models"
	"api/utils"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// POST /register
func signup(ctx *gin.Context) {
	var user models.User

	err := ctx.ShouldBindJSON(&user)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": "Could not parse the request!"})
		return
	}

	fmt.Println(user)

	err = user.Save()

	if err != nil {
		fmt.Println(err)

		if err.Error() == "pq: duplicate key value violates unique constraint \"users_email_key\"" {
			ctx.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": "Email must be unique!"})
			return
		}

		if err.Error() == "pq: duplicate key value violates unique constraint \"users_login_key\"" {
			ctx.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": "Username must be unique!"})
			return
		}

		// ctx.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest ,"message": "Username and email must be unique!"})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"code": http.StatusCreated, "message": "User created successfully!"})
}

// POST /login
func login(ctx *gin.Context) {
	var user models.User

	err := ctx.ShouldBindJSON(&user)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": "Could not parse the request!"})
		return
	}

	userID, err := user.Authenticate()

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized, "message": "Could not authenticate!"})
		return
	}

	token, err := utils.GenerateToken(user.Email, int64(user.ID))

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": "Failed to generate token!"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code":    http.StatusOK,
		"data": gin.H{
			"message": "Logged in successfully!",
			"token":   token,
			"username": user.Username,
			"userId":  userID,
			"email":   user.Email,
		},
	})
}