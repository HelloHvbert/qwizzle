package routes

import (
	"api/models"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GET /sets
func getSets(c *gin.Context) {
	sets, err := models.GetAllSets()

	var response []map[string]interface{}
	for _, set := range sets {
		response = append(response, map[string]interface{}{
			"id":          set.ID,
			"name":        set.Name,
			"description": set.Description,
			"langFrom":    set.LangFrom,
			"langTo":      set.LangTo,
			"userId":      set.UserID,
			"user":        set.User,
			"count":       set.Count,
		})
	}

	// server error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "data": response})
}

// GET /sets/:id
func getSetByID(c *gin.Context) {
	id := c.Param("id")

	setId, err := strconv.ParseInt(id, 10, 64)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": err.Error()})
		return
	}

	set, err := models.GetSetByID(setId)

	// User tries to get a set that does not exist
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": http.StatusNotFound, "message": "Set not found"})
		return
	}

	if set.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"code": http.StatusNotFound, "message": "Set not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "data": set})
}

// GET /sets/user
func getSetsByUser(c *gin.Context) {
	id := c.GetInt64("userId")

	sets, err := models.GetOwnedSets(int(id))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": err.Error()})
		return
	}

	if len(sets) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"code": http.StatusNotFound, "message": "No sets found"})
		return
	}

	var response []map[string]interface{}
	for _, set := range sets {
		response = append(response, map[string]interface{}{
			"id":          set.ID,
			"name":        set.Name,
			"description": set.Description,
			"langFrom":    set.LangFrom,
			"langTo":      set.LangTo,
			"userId":      set.UserID,
			"user":        set.User,
			"count":       set.Count,
		})
	}

	c.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "data": response})
}


// POST /sets
func createSet(c *gin.Context) {
	var set models.Set
	if err := c.ShouldBindJSON(&set); err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": err.Error()})
		return
	}

	if len(set.Items) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": "Set must have at least one item"})
		return
	}

	userId := c.GetInt64("userId")
	username, err := models.GetUsernameById(int(userId))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": err.Error()})
		return
	}

	set.UserID = int(userId)
	set.User = username

	newId, err := set.Save()

	// server error
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": err.Error()})
		return
	}

	set.ID = newId

	c.JSON(http.StatusCreated, gin.H{"code": http.StatusCreated, "data": set})
}

// PUT /sets/:id
func updateSet(c *gin.Context) {
	setId := c.Param("id")
	userId := c.GetInt64("userId")

	id64, err := strconv.ParseInt(setId, 10, 64)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": err.Error()})
		return
	}

	set, err := models.GetSetByID(id64)
	fmt.Println(set)

	// User tries to update a set that does not exist
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": "Failed to get the event"})
		return
	}

	// User tries to update a set that does not belong to him
	if set.UserID != int(userId) {
		c.JSON(http.StatusForbidden, gin.H{"code": http.StatusForbidden, "message": "You are not allowed to update this event"})
		return
	}

	var newSet models.Set
	// Bad request
	if err := c.ShouldBindJSON(&newSet); err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": err.Error()})
		return
	}
	fmt.Println("essa")
	fmt.Println(newSet.Items)

	id, err := strconv.ParseInt(c.Param("id"), 10, 64)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": "conv"})
		return
	}

	newSet.ID = int(id)
	err = newSet.Update()

	// server error
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": "Failed to update the event"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "data": newSet})

}

// DELETE /sets/:id
func deleteSet(c *gin.Context) {
	id := c.Param("id")

	setId, err := strconv.ParseInt(id, 10, 64)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": err.Error()})
		return
	}

	set, err := models.GetSetByID(setId)
	
	// User tries to delete a set that does not exist
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": http.StatusNotFound, "message": "Set not found"})
		return
	}

	userID := c.GetInt64("userId")

	// User tries to delete a set that does not belong to him
	if set.UserID != int(userID) {
		c.JSON(http.StatusForbidden, gin.H{"code": http.StatusForbidden, "message": "You are not allowed to delete this set"})
		return
	}

	err = models.DeleteSet(id)
	// server error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": http.StatusNoContent, "message": "Set deleted"})
}