const express = require('express');
const app = express();
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { elements } = require('chart.js');
const { format, parseISO } = require('date-fns');
dotenv.config({ path: './../.env' });

const port = 5000;

app.use(bodyParser.urlencoded({ extended: false }))
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
  const { email, password } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      connection.release();
      return;
    } else {
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
      connection.query('SELECT f.form_id, f.form_title, f.form_question, COUNT(v.form_sid) AS value_count FROM form f LEFT JOIN `value` v ON f.form_sid = v.form_sid GROUP BY f.form_sid, f.form_title', (err, results) => {
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
                questionTypes[index] = question.id;
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

app.get('/progress', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      connection.release();
      return;
    }
    else {
      connection.query(
        `SELECT 
          p.publish_end, 
          p.min_respondent, 
          f.form_title, 
          COUNT(v.value_sid) AS value_count
        FROM publish p
        LEFT JOIN form f ON p.form_sid = f.form_sid
        LEFT JOIN \`value\` v ON p.form_sid = v.form_sid
          AND v.value_timestamp BETWEEN p.publish_start AND p.publish_end
        WHERE NOW() BETWEEN p.publish_start AND p.publish_end
          AND p.min_respondent IS NOT NULL
          AND p.min_respondent > 0
        GROUP BY p.publish_end, p.min_respondent, f.form_title;`,
        (err, results) => {
          if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            connection.release();
            return;
          }
          if (results.length > 0) {
            console.log(results)
            res.json(results);
            connection.release();
          }
        })
    }
  })
})

app.get('/trend', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      connection.release();
      return;
    }
    else {
      connection.query(
        `WITH RECURSIVE months AS (
            SELECT
                MIN(DATE_FORMAT(value_timestamp, '%Y-%m-01')) AS month_start
            FROM \`value\`
            
            UNION ALL
            
            SELECT 
                DATE_ADD(month_start, INTERVAL 1 MONTH)
            FROM months
            WHERE month_start < (SELECT MAX(DATE_FORMAT(value_timestamp, '%Y-%m-01')) FROM \`value\`)
        )
        SELECT
            IFNULL(COUNT(v.value_sid), 0) AS count,
            IFNULL(FLOOR(COUNT(v.value_sid) / NULLIF(COUNT(DISTINCT v.form_sid), 0)), 0) AS average,
            DATE_FORMAT(m.month_start, '%M %Y') AS month
        FROM months m
        LEFT JOIN \`value\` v
            ON DATE_FORMAT(v.value_timestamp, '%Y-%m') = DATE_FORMAT(m.month_start, '%Y-%m')
        GROUP BY m.month_start
        ORDER BY m.month_start;`,
        (err, results) => {
          if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            connection.release();
            return;
          }
          if (results.length > 0) {
            const trendValue = {
              count: [],
              average: [],
              month: []
            }
            results.forEach(element => {
              trendValue.count.push(element.count);
              trendValue.average.push(element.average);
              trendValue.month.push(element.month);
            })
            res.json(trendValue);
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
    connection.beginTransaction((err, results) => {
      connection.query('INSERT INTO form VALUES (DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT)');
      connection.query('SELECT LAST_INSERT_ID() AS form_sid', (err, results) => {
        if (err) { connection.rollback(); }
        else {
          connection.query(
            'INSERT INTO catalog (catalog_sid, form_sid, user_sid, date_of_creation) VALUES (DEFAULT, ?, (SELECT user_sid FROM user WHERE user_email = ?), DEFAULT)'
            , [results[0].form_sid, email]
          )
        }
      })
      if (err) { connection.rollback(() => connection.release()); console.log(err); }
      else { connection.commit(); connection.release(); res.json(results); }
    })
  })
});

app.post('/create/:id', (req, res) => {
  const { email } = req.body;
  const form_id = req.params.id;
  console.log(form_id)
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      connection.release();
      return;
    }
    connection.beginTransaction((err, results) => {
      connection.query('SELECT form_question FROM form WHERE form_id = ?', [form_id], (err, results) => {
        console.log(results)
        if (err) { connection.rollback(); }
        else {
          connection.query('INSERT INTO form VALUES (DEFAULT, DEFAULT, DEFAULT, DEFAULT, ?)', [results[0].form_question]);
        }
        connection.query('SELECT LAST_INSERT_ID() AS form_sid', (err, results) => {
          if (err) { connection.rollback(); }
          else {
            console.log(results)
            connection.query(
              'INSERT INTO catalog (catalog_sid, form_sid, user_sid, date_of_creation) VALUES (DEFAULT, ?, (SELECT user_sid FROM user WHERE user_email = ?), DEFAULT)'
              , [results[0].form_sid, email]
            )
          }
        })
      })
      if (err) { connection.rollback(() => connection.release()); console.log(err); }
      else { connection.commit(); connection.release(); res.json(results); }
    })
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
    connection.beginTransaction((err, results) => {
      connection.query("DELETE FROM catalog WHERE form_sid IN (SELECT form_sid FROM form WHERE form_id = ?);", [req.params.id])
      connection.query("DELETE FROM publish WHERE form_sid IN (SELECT form_sid FROM form WHERE form_id = ?);", [req.params.id])
      connection.query("DELETE FROM \`value\` WHERE form_sid IN (SELECT form_sid FROM form WHERE form_id = ?);", [req.params.id])
      connection.query("DELETE FROM form WHERE form_id = ?", [req.params.id])
      if (err) { connection.rollback(() => connection.release()); console.log(err); }
      else {
        connection.commit();
        connection.release();
        res.json(results);
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
      console.error('Error getting database connection:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    connection.query(
      `SELECT form_question FROM form WHERE form_id = ?`,
      [req.params.id],
      async (err, results) => {
        if (err) {
          console.error('Error executing SQL query:', err);
          connection.release();
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        const questionArray = JSON.parse(results[0].form_question)[req.query.index];
        const answerElement = questionArray.answerElement || [];
        const newValueArray = [];
        const publishStart = req.query.publish_start ? Array.from(new Set(req.query.publish_start)) : [];
        const publishEnd = req.query.publish_end ? Array.from(new Set(req.query.publish_end)) : [];
        const type = questionArray.type;
        if (publishStart.length <= 0 && publishEnd.length <= 0) {
          connection.query(
            `SELECT v.value_data FROM \`value\` v 
              LEFT JOIN form f ON v.form_sid = f.form_sid WHERE f.form_id = ?`,
            [req.params.id],
            (err, results) => {
              if (err) {
                console.error('Error executing SQL query:', err);
                connection.release();
                return res.status(500).json({ error: 'Internal Server Error' });
              }
              if (results.length > 0) {
                let newValue;
                if (type !== 'text' && type !== 'scale') {
                  newValue = answerElement.reduce((acc, curr) => {
                    acc[String(curr)] = 0;
                    return acc;
                  }, {});
                } else if (type === 'text') {
                  newValue = {};
                } else if (type === 'scale') {
                  newValue = {};
                  const scaleSize = Number(questionArray.setting.scaleSize)
                  for (let i = 0; i < scaleSize * 2 + 3; i++) {
                    newValue[i] = 0
                  }
                }
                const valueArray = results.map(element =>
                  JSON.parse(element.value_data)[req.query.index]
                ).filter(Boolean);
                if (valueArray.length > 0) {
                  valueArray.forEach((element, index) => {
                    if (type === "text") {
                      newValue[index] = element.value;
                    } 
                    else if (type === "scale") {
                      newValue[element.value] = (newValue[element.value] || 0) + 1;
                    } 
                    else {
                      if (element.value.length > 0) {
                        element.value.forEach(i => {
                          const questionElement = answerElement[i];
                          newValue[questionElement] = (newValue[questionElement] || 0) + 1;
                        });
                      }
                    }
                  });
                }
                newValueArray.push(newValue);
                res.json(newValueArray);
              } else {
                res.json([]);
              }
              connection.release();
            }
          );
        } else {
          const promises = publishStart.map((start, i) => {
            return new Promise((resolve, reject) => {
              let newValue;
              if (type !== 'text' && type !== 'scale') {
                newValue = answerElement.reduce((acc, curr) => {
                  acc[String(curr)] = 0;
                  return acc;
                }, {});
              } else if (type === 'text') {
                newValue = {};
              } else if (type === 'scale') {
                newValue = {};
                const scaleSize = Number(questionArray.setting.scaleSize)
                for (let i = 0; i < scaleSize * 2 + 3; i++) {
                  newValue[i] = 0
                }
              }
              connection.query(
                `SELECT v.value_data FROM \`value\` v 
                  LEFT JOIN form f ON v.form_sid = f.form_sid WHERE f.form_id = ?
                  AND (
                    (? IS NULL AND ? IS NULL) 
                    OR 
                    (v.value_timestamp BETWEEN ? AND ?)
                )`,
                [
                  req.params.id,
                  start || null,
                  publishEnd[i] || null,
                  format(parseISO(start), 'yyyy-MM-dd HH:mm:ss'),
                  format(parseISO(publishEnd[i]), 'yyyy-MM-dd HH:mm:ss')
                ],
                (err, results) => {
                  if (err) {
                    console.error('Error executing SQL query:', err);
                    return reject(err);
                  }
                  const valueArray = results.map(element =>
                    JSON.parse(element.value_data)[req.query.index]
                  ).filter(Boolean);
                  if (valueArray.length > 0) {
                    valueArray.forEach((element, index) => {
                      if (type === "text") {
                        newValue[index] = element.value;
                      } 
                      else if (type === "scale") {
                        newValue[element.value] = (newValue[element.value] || 0) + 1;
                      } 
                      else {
                        if (element.value.length > 0) {
                          element.value.forEach(i => {
                            const questionElement = answerElement[i];
                            newValue[questionElement] = (newValue[questionElement] || 0) + 1;
                          });
                        }
                      }
                    });
                  }
                  newValueArray.push(newValue);
                  resolve();
                }
              );
            });
          });

          try {
            await Promise.all(promises);
            console.log(newValueArray)
            res.json(newValueArray);
          } catch (error) {
            console.error('Error in processing:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          } finally {
            connection.release();
          }
        }
      }
    );
  });
});



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
  const { values } = req.body;
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
              connection.query('INSERT INTO `value` (value_sid, form_sid, value_data, value_timestamp) VALUES (DEFAULT, ?, ?, NOW())', [results[0].form_sid, JSON.stringify(values)], (err) => {
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
      connection.query('SELECT NOW() as date_now, form_sid FROM form WHERE form_id = ?', [req.params.id], (err, results) => {
        if (err) {
          console.error('Error executing SQL query:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
        else {
          const dateNow = results[0].date_now;
          connection.query('SELECT publish_sid, publish_start, publish_end, min_respondent FROM publish WHERE form_sid = ? ORDER BY publish_sid DESC ', [results[0].form_sid], (err, results) => {
            if (err) {
              console.error('Error executing SQL query:', err);
              res.status(500).json({ error: 'Internal Server Error' });
              connection.release();
              return;
            }
            if (results.length > 0) {
              const newResult = Object.assign({date_now: dateNow}, results[0])
              console.log(newResult)
              res.json(newResult);
              connection.release();
            }
            else {
              res.json({ date_now: dateNow })
              connection.release();
            }
          })
        }
      })
    }
  })
})

app.post("/publish/:id", (req, res) => {
  const { start, end, min_respondent } = req.body;
  console.log(req.body)
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
          connection.query(
            `INSERT INTO publish (form_sid, publish_start, publish_end, min_respondent) 
            VALUES (
              ?, 
              ?, 
              ?,
              ?
            )`, 
            [results[0].form_sid, format(parseISO(start), 'yyyy-MM-dd HH:mm:ss'), format(parseISO(end), 'yyyy-MM-dd HH:mm:ss'), min_respondent], (err, results) => {
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