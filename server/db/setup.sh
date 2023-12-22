psql -f install.sql -U postgres
PGPASSWORD=einstein psql -d uni_fantasy_football -f structure.sql -U einstein
PGPASSWORD=einstein psql -d uni_fantasy_football -f data.sql -U einstein
