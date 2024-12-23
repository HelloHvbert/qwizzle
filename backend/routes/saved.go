package routes

import (
	"api/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GET /sets/saved
func getSavedSets(c *gin.Context) {
	userId := c.GetInt64("userId")
	sets, err := models.GetSavedSets(userId)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "data": sets})
}

// POST /sets/saved/:id
func addSetToSaved(c *gin.Context) {
	setId, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": "Invalid id"})
		return
	}

	userId := c.GetInt64("userId")
	err = models.AddSetToSaved(userId, int(setId))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"code": http.StatusCreated, "message": "Set saved"})
}

// DELETE /sets/saved/:id
func removeSetFromSaved(c *gin.Context) {
	setId, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": "Invalid id"})
		return
	}

	userId := c.GetInt64("userId")
	err = models.RemoveSetFromSaved(userId, int(setId))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "message": "Set removed from saved"})
}