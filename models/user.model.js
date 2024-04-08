const sql = require("./db.js");

const User = function(user) {
    this.name = user.name;
    this.description = user.description;
    this.grade = user.grade;
};

User.create = (newUser, result) => {
    sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
        if(err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created user: ", { id:res.insertId, ...newUser });
        result(null, { id: res.insertId, ...newUser });
    });
};

User.findById = (id, result) => {
    sql.query(`SELECT * FROM users WHERE id = ${id}`, (err, res) => {
        if(err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if(res.length) {
            console.log("found user: ", res[0]);
            result(null, res[0]);
            return;
        }

        result({ kind: "not_found"}, null);
    });
}

User.updateById = (id, user, result) => {
    sql.query(
        "UPDATE users SET name = ?, description = ?, grade = ? WHERE id = ?",
        [user.name, user.description, user.grade, id],
        (err, res) => {
            if(err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if(res.affectedRows == 0) {
                // not found User with the id
                result({ kind: "not_found"}, null);
                return;
            }

            console.log("updated user: ", { id: id, ...user });
            result(null, { id: id, ...user});
        }
    );
};

User.remove = (id, result) => {
    sql.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
        if(err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if(res.affectedRows == 0) {
            result({ kind: "not_found"}, null);
            return;
        }

        console.log("deleted user with id ", id);
        result(null, res);
    });
};


module.exports = User;