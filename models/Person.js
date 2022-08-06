const db = require("../config/connection");
require("dotenv").config();
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

class Person {
  getAll() {
    return db.query(
      ` SELECT 
        people.id,
        pgp_sym_decrypt(first_name::bytea, $1) as first_name,
        pgp_sym_decrypt(last_name::bytea, $1) as last_name,
        pgp_sym_decrypt(phone::bytea, $1) as phone,
        github_id,
        pgp_sym_decrypt(avatar::bytea, $1) as avatar,
        addresses.*
        FROM people INNER JOIN addresses ON people.id = addresses.person_id ORDER BY last_name DESC`,
      [ENCRYPTION_KEY]
    );
  }

  findUser({ github_id }) {
    return db.query(
      `SELECT 
        github_id, 
        pgp_sym_decrypt(first_name::bytea, $1) as first_name,
        pgp_sym_decrypt(last_name::bytea, $1) as last_name
        FROM people WHERE github_id = $2`,
      [ENCRYPTION_KEY, github_id]
    );
  }
  create({ first_name, last_name, phone, github_id, avatar }) {
    return db.query(
      `INSERT INTO 
        people(first_name, last_name, phone, github_id, avatar) 
        VALUES (
          PGP_SYM_ENCRYPT($1, $6),
          PGP_SYM_ENCRYPT($2, $6),
          PGP_SYM_ENCRYPT($3, $6),
          $4,
          PGP_SYM_ENCRYPT($5, $6)
        )
        RETURNING *`,
      [first_name, last_name, phone, github_id, avatar, ENCRYPTION_KEY]
    );
  }
}

module.exports = new Person();
