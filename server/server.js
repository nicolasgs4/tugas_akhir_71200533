const express = require('express');
const app = express();
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: './../.env' });

const port = 5000;

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123',
  database: 'skripsi-form',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
  connection.release();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post('/login', (req, res) => {
  const {email, password} = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      connection.release();
      return;
    } else{
      pool.query('SELECT * FROM user WHERE user_email = ? AND user_password = ?', [email, password], (err, results) => {
        if (err) {
          console.error('Error executing SQL query:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
        if (results.length > 0) {
          const token = jwt.sign(
            { email: results[0].user_email, username: results[0].user_name }, process.env.REACT_APP_JWT_KEY
          )
          res.json({ email: results[0].user_email, token: token });
        }
      });
    }
  })
});

app.post('/main', (req, res) => {
  const { token } = req.body

  const data = jwt.verify(token, process.env.REACT_APP_JWT_KEY)

  pool.query('SELECT * FROM user WHERE user_email = ? AND user_name = ?', [data.email, data.username], (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    if (results.length > 0) {
      res.json({ email: results[0].user_email, username: results[0].user_name });
    }
  });
});

app.get('/dashboard', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      connection.release();
      return;
    } 
    else {
      connection.query('SELECT f.form_id, f.form_title, f.form_question, COUNT(v.form_sid) AS value_count FROM form f LEFT JOIN `value` v ON f.form_sid = v.form_sid GROUP BY f.form_sid, f.form_title; ', (err, results) => {
        if (err) {
          console.error('Error executing SQL query:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          connection.release();
          return;
        } 
        if (results.length > 0) {
            const newResults = {};
            results.forEach(element => {
              const questionTypes = {};
              if (element.form_question) {
                JSON.parse(element.form_question).forEach((question, index) => {
                  if (
                    question.type === "scale" ||
                    question.type === "toggle" ||
                    question.type === "multi"
                  ) {
                    questionTypes[index] = question.type;
                  }
                  if (question.type === "text"){
                    questionTypes[index] = question.type;
                  }
                });
              }
              
              newResults[element.form_id] = {
                form_title: element.form_title,
                question_type: questionTypes,
                value_count: element.value_count
              };
            });
          res.json(newResults);
          connection.release();
        }
      })
    }
  })
})

app.get('/create', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      connection.release();
      return;
    } 
    else {
      connection.query('SELECT form.form_id, form.form_title, user.user_name, catalog.date_of_creation FROM catalog INNER JOIN form ON catalog.form_sid = form.form_sid INNER JOIN user ON catalog.user_sid = user.user_sid', (err, results) => {
        if (err) {
          console.error('Error executing SQL query:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          connection.release();
          return;
        }
        if (results.length > 0) {
          res.json(results);
          connection.release();
        }
      })
    }
  })
})

app.post('/create', (req, res) => {
  const { email } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      connection.release();
      return;
    }
    connection.beginTransaction((err) => {
      if (err) connection.rollback(() => connection.release());
      else {
        connection.query('INSERT INTO form VALUES (DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT)', (err) => { 
          if (err) {connection.rollback(() => connection.release());}
        })
        connection.query('SELECT LAST_INSERT_ID() as form_sid FROM form', (err, results) => {
          if (err) {connection.rollback();}
          else {
            connection.query('INSERT INTO catalog (catalog_sid, form_sid, user_sid, date_of_creation) VALUES (DEFAULT, ?, (SELECT user_sid FROM user WHERE user_email = ?), DEFAULT)', [results[0].form_sid, email], (err) => {
              if (err) {connection.rollback(() => connection.release()); console.log(err);}
              else { connection.commit(); connection.release(); res.json(results); }
            })
          }
        })
    }})
  })
});

app.delete('/create/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      connection.release();
      return;
    }
    connection.beginTransaction((err) => {
      if (err) connection.rollback(() => connection.release());
      else {
        connection.query('DELETE catalog FROM catalog INNER JOIN form ON catalog.form_sid = form.form_sid WHERE form.form_id = ?', [req.params.id], (err) => {
          if (err) { connection.rollback(() => connection.release()); console.log(err); }
          else {
            connection.query('DELETE form FROM form WHERE form_id = ?', [req.params.id], (err, results) => {
              if (err) { connection.rollback(() => connection.release()); console.log(err); }
              else { connection.commit(); connection.release(); res.json(results);}
            })
          }
        })
      }
    })
  })
});

app.get("/form/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      connection.release();
      return;
    }
    else {
      connection.query('SELECT form_title, form_description, form_question FROM form WHERE form_id = ?', [req.params.id], (err, results) => {
        if (err) {
          console.error('Error executing SQL query:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
        if (results.length > 0) {
          res.json(results[0]);
          connection.release();
        }
      })
    }
  })
})

app.get("/value/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      connection.release();
      return;
    }
    else {
      let publishStart = req.query.publish_start == undefined ? null : req.query.publish_start;
      let publishEnd = req.query.publish_end == undefined ? null : req.query.publish_end;

      connection.query('SELECT value_data FROM `value` WHERE form_sid = (SELECT form_sid FROM form WHERE form_id = ?) AND (? IS NULL OR value_timestamp > ?) AND (? IS NULL OR value_timestamp < ?)', [req.params.id, publishStart, publishStart, publishEnd, publishEnd], (err, results) => {
        if (err) {
          console.error('Error executing SQL query:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          connection.release();
          return;
        }
        const resultArray = [];
        console.log()
        results.forEach(element => {

          resultArray.push(JSON.parse(element.value_data)[0])
        })
        if (resultArray.length > 0 ) {
          const newResults = {}
          resultArray.map((element, index) => {
            if (
              element.type === "scale" ||
              element.type === "multi" ||
              element.type === "rating" ||
              element.type === "toggle"
            ) {
              if (element.value.length > 1) {
                element.value.forEach(valueElement => {
                  if (newResults[valueElement]) {
                    newResults[valueElement] += 1;
                  }
                  else {
                    newResults[valueElement] = 1;
                  }
                })
              }
            }
            if (req.query.type === "text") {
              newResults[index] = element.value;
            }
          });

          console.log(newResults)
          res.json(newResults);
          connection.release();
        } 
        else {
          res.json([]);
          connection.release();
          return;
        }
      })
    }
  })
})

app.patch('/form/:id', (req, res) => {
  const { formJson, formTitle, formDescription } = req.body;

  const edit = req.query.edit;

  if (edit === 'detail') {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        connection.release();
        return;
      }
      connection.beginTransaction((err) => {
        if (err) connection.rollback(() => connection.release());
        else {
          connection.query('UPDATE form SET form_title = ?, form_description = ? WHERE form_id = ?', [formTitle, formDescription, req.params.id], (err, results) => {
            if (err) { connection.rollback(() => connection.release()); }
            else { connection.commit(); connection.release(); res.json(results); }
          })
        }
      })
    })
  } 

  if (edit === 'question') {
    const form_question = JSON.stringify(formJson)
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        connection.release();
        return;
      }
      connection.beginTransaction((err) => {
        if (err) connection.rollback(() => connection.release());
        else {
          connection.query('UPDATE form SET form_question = ? WHERE form_id = ?', [form_question, req.params.id], (err, results) => {
            if (err) { connection.rollback(() => connection.release()); }
            else { connection.commit(); connection.release(); res.json(results); }
          })
        }
      })
    })
  }
});

app.post("/form/:id/fill", (req, res) => {
  const { values, timestamp } = req.body;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      connection.release();
      return;
    } 
    else {
      connection.query('SELECT form_sid FROM form WHERE form_id = ?', [req.params.id], (err, results) => {
        if (err) {
          console.error('Error executing SQL query:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
        if (results.length > 0) {
          connection.beginTransaction((err) => {
            if (err) connection.rollback(() => connection.release());
            else {
              connection.query('INSERT INTO `value` (value_sid, form_sid, value_data, value_timestamp) VALUES (DEFAULT, ?, ?, ?)', [results[0].form_sid, JSON.stringify(values), timestamp], (err) => {
                if (err) { connection.rollback(() => connection.release()); console.log(err); }
                else { connection.commit(); connection.release(); res.json(results); }
              })
            }
          })
        }
      })
    }
  })
})

app.get("/publish/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      connection.release();
      return;
    } 
    else {
      connection.query('SELECT form_sid FROM form WHERE form_id = ?', [req.params.id], (err, results) => {
        if (err) {
          console.error('Error executing SQL query:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
        else {
          connection.query('SELECT publish_sid, publish_start, publish_end, min_respondent FROM publish WHERE form_sid = ? ORDER BY publish_sid DESC ', [results[0].form_sid], (err, results) => {
            if (err) {
              console.error('Error executing SQL query:', err);
              res.status(500).json({ error: 'Internal Server Error' });
              connection.release();
              return;
            }
            if (results.length > 0) {
              res.json(results);
              connection.release();
            }
          })
        }
      })
    }
  })
})

app.post("/publish/:id", (req, res) => {
  const { start, end } = req.body;
  console.log(start);
  console.log(end);
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      connection.release();
      return;
    }
    else {
      connection.query('SELECT form_sid FROM form WHERE form_id = ?', [req.params.id], (err, results) => {
        if (err) {
          console.error('Error executing SQL query:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          connection.release();
          return;
        }
        else {
          console.log(results[0])
          connection.query('INSERT INTO publish (form_sid, publish_start, publish_end) VALUES (?, ?, ?)', [results[0].form_sid, start, end], (err, results) => {
            if (err) {
              console.error('Error executing SQL query:', err);
              res.status(500).json({ error: 'Internal Server Error' });
              connection.release();
              return;
            }
            else {
              res.json(results);
              connection.release();
            }
          })
        }
      })
    }
  })
})