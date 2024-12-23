-- Tworzenie bazy danych
CREATE DATABASE qwizzle;

-- Użycie utworzonej bazy danych
\c qwizzle;

DROP TABLE IF EXISTS Saved;
-- Tworzenie tabeli users z kolumną isAdmin
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    login VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    date_of_birth DATE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isAdmin BOOLEAN DEFAULT FALSE -- Kolumna wskazująca, czy użytkownik jest administratorem
);

DROP TABLE IF EXISTS Sets;
-- Tworzenie tabeli Sets
CREATE TABLE Sets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    createdBy INT NOT NULL,
    langFrom VARCHAR(50) NOT NULL,
    langTo VARCHAR(50) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS SetItems;
-- Tworzenie tabeli SetItems
CREATE TABLE SetItems (
    id SERIAL PRIMARY KEY,
    setId INT NOT NULL,
    ogName VARCHAR(255) NOT NULL,
    translated VARCHAR(255) NOT NULL,
    photoURL VARCHAR(255),
    FOREIGN KEY (setId) REFERENCES Sets(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS Ratings;
-- Tworzenie tabeli Ratings
CREATE TABLE Ratings (
    ratingId SERIAL PRIMARY KEY,
    createdBy INT NOT NULL,
    setId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comment TEXT,
    rating FLOAT CHECK (rating >= 0 AND rating <= 5),
    FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (setId) REFERENCES Sets(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS Saved;
-- Tworzenie tabeli Saved
CREATE TABLE Saved (
    savedId SERIAL PRIMARY KEY,
    userId INT NOT NULL,
    setId INT NOT NULL,
    savedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (setId) REFERENCES Sets(id) ON DELETE CASCADE
);


-- INSERTING
-- Dodawanie użytkowników z rolą administratora
INSERT INTO users (name, surname, login, password, date_of_birth, isAdmin)
VALUES 
('John', 'Doe', 'user1', 'password1', '1990-01-01', FALSE),
('Jane', 'Smith', 'admin1', 'admin', '1985-05-15', TRUE), -- Admin
('Alice', 'Johnson', 'user2', 'password2', '1992-09-23', FALSE),
('Admin', 'User', 'admin2', 'admin', '1980-12-12', TRUE); -- Admin

-- Wstawianie przykładowych danych do tabeli Sets
INSERT INTO Sets (title, createdBy, langFrom, langTo, description)
VALUES 
('Basic English-Spanish Vocabulary', 1, 'English', 'Spanish', 'A set of basic English-Spanish vocabulary words.'),
('Advanced French Terms', 2, 'French', 'English', 'A set of advanced French terms.'),
('German Nouns 101', 3, 'German', 'English' , 'A set of basic German nouns.');

-- Wstawianie przykładowych danych do tabeli SetItems
INSERT INTO SetItems (setId, ogName, translated, photoURL)
VALUES 
(1, 'Apple', 'Manzana', 'https://example.com/apple.jpg'),
(1, 'Book', 'Libro', NULL),
(2, 'Bonjour', 'Hello', NULL),
(2, 'Merci', 'Thank you', 'https://example.com/merci.jpg'),
(3, 'Haus', 'House', NULL),
(3, 'Auto', 'Car', 'https://example.com/auto.jpg');

-- Wstawianie przykładowych danych do tabeli Ratings
INSERT INTO Ratings (createdBy, setId, comment, rating)
VALUES 
(1, 2, 'Great set of advanced terms!', 4.5),
(2, 3, 'Very helpful for beginners.', 4.8),
(3, 1, 'Good for basics.', 4.0);

-- Wstawianie przykładowych danych do tabeli Saved z zabezpieczeniem, aby twórca nie mógł zapisać własnego zestawu
-- Wstawianie przykładowych danych do tabeli Saved
INSERT INTO Saved (userId, setId)
VALUES 
(1, 3),
(2, 1),
(3, 2);