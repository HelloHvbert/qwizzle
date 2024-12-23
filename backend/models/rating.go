package models

import (
	"api/db"
	"errors"
	"fmt"
)

type Rating struct {
	ID        int     `json:"id"`
	Rating    float64 `json:"rating"`
	Comment   string  `json:"comment"`
	Username  string  `json:"username"`
	UserID    int     `json:"userId"`
	Createdat string  `json:"createdat"`
	SetID     int     `json:"-"`
}

func (s *Set) GetRatings() ([]Rating, error) {
	ratings := []Rating{}
	query := `SELECT ratings.id, login, users.id, rating, comment, ratings.createdat FROM ratings JOIN users ON users.id = ratings.createdby WHERE setid = $1`
	rows, err := db.DB.Query(query, s.ID)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var rating Rating
		err := rows.Scan(&rating.ID, &rating.Username, &rating.UserID, &rating.Rating, &rating.Comment, &rating.Createdat)

		if err != nil {
			return nil, err
		}

		ratings = append(ratings, rating)
	}
	return ratings, nil
}

func (s *Set) GetRatingByUser(userId int64) (Rating, error) {
	var rating Rating
	query := `SELECT id FROM ratings WHERE setid = $1 AND createdby = $2`
	row := db.DB.QueryRow(query, s.ID, userId)
	err := row.Scan(&rating.ID)

	if err != nil {
		return Rating{}, err
	}

	return rating, nil
}

func (s *Set) SaveRating(rating Rating) (int, error) {
	fmt.Println(rating)
	query := `INSERT INTO ratings (setid, createdby, rating, comment) VALUES ($1, $2, $3, $4) returning id`
	row := db.DB.QueryRow(query, s.ID, rating.UserID, rating.Rating, rating.Comment)

	err := row.Scan(&rating.ID)

	if err != nil {
		return 0, err
	}

	return rating.ID, err

}

func (r Rating) UpdateRating() error {
	fmt.Println(r.SetID, r.UserID)
	query := `UPDATE ratings SET rating = $1, comment = $2 WHERE setid = $3 AND createdby = $4`
	stmt, err := db.DB.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()
	_, err = stmt.Exec(r.Rating, r.Comment, r.SetID, r.UserID)


	return err
}

func (r Rating) DeleteRating() error {
	query := `DELETE FROM ratings WHERE setid = $1 AND createdby = $2`
	stmt, err := db.DB.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()
	result, err := stmt.Exec(r.SetID, r.UserID)

	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()

	if rows == 0 {
		return errors.New("rating not found")
	}

	return err
}

func CheckIfRatingExists(setId int, userId int) (bool, error) {
	query := `SELECT id FROM ratings WHERE setid = $1 AND createdby = $2`
	row := db.DB.QueryRow(query, setId, userId)

	var id int
	err := row.Scan(&id)

	if err != nil {
		return false, nil
	}

	return true, nil
}