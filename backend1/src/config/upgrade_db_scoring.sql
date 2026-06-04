// Skrypt migracyjny: Dodanie kryteriów punktowych do tabeli wniosków
// Uruchomić na lokalnej bazie MySQL projektu

ALTER TABLE wnioski // nazwa tabeli? 
ADD COLUMN is_wielodzietnosc BOOLEAN DEFAULT FALSE,
ADD COLUMN is_niepelnosprawnosc BOOLEAN DEFAULT FALSE,
ADD COLUMN income_per_capita DECIMAL(10, 2) DEFAULT 0.00,
ADD COLUMN scoring_points INT DEFAULT 0;
