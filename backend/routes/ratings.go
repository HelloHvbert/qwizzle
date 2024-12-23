package routes

import (
	"api/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GET /sets/:id/ratings
func getSetRatings(c *gin.Context) {
	id := c.Param("id")
	setId, err := strconv.ParseInt(id, 10, 64)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": err.Error()})
		return
	}

	set, err := models.GetSetByID(setId)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": http.StatusNotFound, "message": "Set not found"})
		return
	}

	ratings, err := set.GetRatings()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "data": ratings})
}

// POST /sets/:id/ratings
func createSetRating(c *gin.Context) {
	id := c.Param("id")
	setId, err := strconv.ParseInt(id, 10, 64)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": err.Error()})
		return
	}

	userID := c.GetInt64("userId")
	set, err := models.GetSetByID(setId)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": http.StatusNotFound, "message": "Set not found"})
		return
	}

	if userID == int64(set.UserID) {
		c.JSON(http.StatusForbidden, gin.H{"code": http.StatusForbidden, "message": "You are not allowed to rate your own set"})
		return
	}

	r, err := set.GetRatingByUser(userID)

	if err == nil && r.ID != 0 {
		c.JSON(http.StatusConflict, gin.H{"code": http.StatusConflict, "message": "You have already rated this set"})
		return
	}

	var rating models.Rating
	rating.UserID = int(userID)
	if err := c.ShouldBindJSON(&rating); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": err.Error()})
		return
	}

	newId, err := set.SaveRating(rating)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": err.Error()})
		return
	}
	rating.ID = newId

	c.JSON(http.StatusCreated, gin.H{"code": http.StatusCreated, "data": rating})
}

// PUT /sets/:id/ratings
func updateSetRating(c *gin.Context) {
	id := c.Param("id")
	userID := c.GetInt64("userId")
	setId, err := strconv.ParseInt(id, 10, 64)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": err.Error()})
		return
	}

	set, err := models.GetSetByID(setId)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": err.Error()})
		return
	}

	if userID == int64(set.UserID) {
		c.JSON(http.StatusForbidden, gin.H{"code": http.StatusForbidden, "message": "You are not allowed to rate your own set"})
		return
	}

	var rating models.Rating
	rating.UserID = int(userID)
	rating.SetID = int(setId)

	if err := c.ShouldBindJSON(&rating); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": err.Error()})
		return
	}

	err = rating.UpdateRating()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "data": rating})
}

// DELETE /sets/:id/ratings
func deleteSetRating(c *gin.Context) {
	id := c.Param("id")
	userID := c.GetInt64("userId")


	var rating models.Rating
	rating.UserID = int(userID)
	setID, err := strconv.ParseInt(id, 10, 64)
	rating.SetID = int(setID)
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": err.Error()})
		return
	}

	err = rating.DeleteRating()

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": http.StatusNotFound, "message": "Rating not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "message": "Rating deleted"})
}