package models

import (
	"api/db"
	"database/sql"
	"fmt"
	"strconv"
	"time"
)
type SetItem struct {
	Front string `json:"front"`
	Back  string `json:"back"`
}

type Set struct {
	ID          int    	`json:"id"`
	Name        string 	`json:"name"`
	Description string 	`json:"description"`
	LangFrom 		string 	`json:"langFrom"`
	LangTo 			string 	`json:"langTo"`
	UserID      int    	`json:"userId"`
	User				string 	`json:"user"`
	Items       []SetItem `json:"items"`
	Count				int			`json:"count"`
	UpdatedAt		string	`json:"updatedAt"`
}


func (s *Set) Save() (int, error) {
	db.DB.Exec("BEGIN")
	query := "INSERT INTO sets (title, createdby, langfrom, langto, description) VALUES ($1, $2, $3, $4, $5) RETURNING id"
	row := db.DB.QueryRow(query, s.Name, s.UserID, s.LangFrom, s.LangTo, s.Description)

	err := row.Scan(&s.ID)
	fmt.Println("id", s.ID)
	if err != nil {
		db.DB.Exec("ROLLBACK")
		return 0, err
	}

	// insert into values
	query = "INSERT INTO setitems (setid, ogname, translated) VALUES "
	// create string like this (front1, back2), (front2, back2), (front3, back3)
	values := ""
	for i, item := range s.Items {
		values += "(" + strconv.Itoa(s.ID) + ", '" + item.Front + "', '" + item.Back + "')"
		if i != len(s.Items) - 1 {
			values += ", "
		} else {
			values += ";"
		}
	}
	// fmt.Println(query + values)
	_, err = db.DB.Exec(query + values)

	if err != nil {
		db.DB.Exec("ROLLBACK")
		return 0, err
	}

	db.DB.Exec("COMMIT")
	return s.ID, nil

}

func GetAllSets() ([]Set, error) {
	sets := []Set{}
	query := `SELECT sets.id, title, description,langfrom, langto, users.login, createdby,
	(SELECT COUNT(*) FROM setitems WHERE setitems.setid = sets.id) as count
	 FROM sets join users on sets.createdby = users.id`
	rows, err := db.DB.Query(query)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var set Set
		var description sql.NullString
		err := rows.Scan(&set.ID, &set.Name, &description, &set.LangFrom, &set.LangTo, &set.User, &set.UserID, &set.Count)

		if err != nil {
			return nil, err
		}
		set.Description = description.String

		sets = append(sets, set)
	}
	return sets, nil
}

func GetSetByID(id int64) (Set, error) {
	var set Set


	query := `SELECT sets.id, title, description, users.login, langfrom, langto, createdby, sets.createdat  FROM sets JOIN users on sets.createdby = users.id WHERE sets.id = $1`
	row := db.DB.QueryRow(query, id)
	var description sql.NullString
	err := row.Scan(&set.ID, &set.Name, &description, &set.User, &set.LangFrom, &set.LangTo, &set.UserID, &set.UpdatedAt)
	set.Description = description.String
	
	if err != nil {
		return set, err
	}

	query1 := `SELECT ogname as front, translated as back FROM setitems WHERE setid = $1`
	rows, err := db.DB.Query(query1, id)

	for rows.Next() {
		var item SetItem
		err := rows.Scan(&item.Front, &item.Back)
		if err != nil {
			return Set{}, err
		}
		set.Items = append(set.Items, item)
	}

	if err != nil {
		return Set{}, err
	}

	return set, nil
}

func GetOwnedSets(userId int) ([]Set, error) {
	sets := []Set{}
	query := `SELECT sets.id, title, description, langfrom, langto, users.login, (select count(*) from setitems where setId=sets.id) as count FROM sets JOIN users ON users.id = sets.createdby WHERE sets.createdby = $1`
	rows, err := db.DB.Query(query, userId)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var set Set
		err := rows.Scan(&set.ID, &set.Name, &set.Description, &set.LangFrom, &set.LangTo, &set.User, &set.Count)

		if err != nil {
			return nil, err
		}

		sets = append(sets, set)
	}
	return sets, nil
}


func (s Set) Update() error {
	//TODO createdat -> upadateAt column DB
	db.DB.Exec("BEGIN")
	query := `UPDATE sets SET title = $1, description = $2, langfrom = $3, langto = $4 , createdat = $5 WHERE id = $6`
	stmt, err := db.DB.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()
	date := time.Now().Format("2006-01-02")
	_, err = stmt.Exec(s.Name, s.Description, s.LangFrom, s.LangTo, date, s.ID)

	if err != nil {
		db.DB.Exec("ROLLBACK")
		return err
	}

	query = `DELETE FROM setitems WHERE setid = $1`
	stmt, err = db.DB.Prepare(query)
	if err != nil {
		db.DB.Exec("ROLLBACK")
		return err
	}
	defer stmt.Close()
	_, err = stmt.Exec(s.ID)

	if err != nil {
		db.DB.Exec("ROLLBACK")
		return err
	}

	query = "INSERT INTO setitems (setid, ogname, translated) VALUES "
	values := ""
	for i, item := range s.Items {
		values += "(" + strconv.Itoa(s.ID) + ", '" + item.Front + "', '" + item.Back + "')"
		if i != len(s.Items) - 1 {
			values += ", "
		} else {
			values += ";"
		}
	}
	_, err = db.DB.Exec(query + values)

	if err != nil {
		db.DB.Exec("ROLLBACK")
		return err
	}

	db.DB.Exec("COMMIT")
	return err
}

func DeleteSet(id string) error {
	query := `DELETE FROM sets WHERE id = $1`
	stmt, err := db.DB.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()
	_, err = stmt.Exec(id)

	return err
}


// ----------------- Saved -----------------

func GetSavedSets(userId int64) ([]Set, error) {
	sets := []Set{}
	query := `SELECT sets.id, title, description, langfrom, langto, users.login, (select count(*) from setitems where setid=sets.id) FROM sets JOIN users ON users.id = sets.createdby WHERE sets.id IN (SELECT setid FROM saved WHERE userid = $1)`

	rows, err := db.DB.Query(query, userId)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var set Set
		err := rows.Scan(&set.ID, &set.Name, &set.Description,&set.LangFrom, &set.LangTo, &set.User, &set.Count)

		if err != nil {
			return nil, err
		}

		sets = append(sets, set)
	}
	return sets, nil
}

func AddSetToSaved(userId int64, setId int) error {
	query := `INSERT INTO saved (userid, setid) VALUES ($1, $2)`
	stmt, err := db.DB.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()
	_, err = stmt.Exec(userId, setId)

	return err
}

func RemoveSetFromSaved(userId int64, setId int) error {
	query := `DELETE FROM saved WHERE userid = $1 AND setid = $2`
	stmt, err := db.DB.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()
	_, err = stmt.Exec(userId, setId)

	return err
}