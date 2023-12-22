CREATE OR REPLACE FUNCTION create_user_team()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_teams (user_id, budget, total_coefficient) VALUES (NEW.user_id, 60.00, 0.00);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_insert
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION create_user_team();

INSERT INTO "users"(username, email, password)
VALUES ('test1', 'test1@example.com', 'test1234');