package routes

import (
	"api/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {

	router.POST("/login", login) //checked
	router.POST("/register", signup) //checked

	auth := router.Group("/")
	auth.Use(middlewares.Authenticate)

	auth.GET("/sets", getSets) //checked
	auth.GET("/sets/user", getSetsByUser)
	auth.POST("/sets", createSet) //checked

	auth.GET("/sets/saved", getSavedSets)
	auth.POST("/sets/saved/:id", addSetToSaved)
	auth.DELETE("/sets/saved/:id", removeSetFromSaved)

	auth.GET("/sets/:id", getSetByID) //checked
	auth.PUT("/sets/:id", updateSet) //checked
	auth.DELETE("/sets/:id", deleteSet) //checked

	auth.GET("/sets/:id/ratings", getSetRatings) //checked
	auth.POST("/sets/:id/ratings", createSetRating) //checked
	auth.PUT("/sets/:id/ratings", updateSetRating)
	auth.DELETE("/sets/:id/ratings", deleteSetRating)

}