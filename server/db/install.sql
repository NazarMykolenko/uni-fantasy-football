DROP DATABASE IF EXISTS uni_fantasy_football;

DROP USER IF EXISTS einstein;

CREATE USER einstein WITH PASSWORD 'einstein';

CREATE DATABASE uni_fantasy_football OWNER einstein;

