// The following commands include all the needed things to load the routes.
const express = require('express');
const router = express.Router();
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
})

client.connect(err => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected to postgres')
  }
});

// GET Login
router.post('/login', (req, res) => {
  const text = `SELECT * FROM (
      SELECT v.vendorid as id, v.vendoremail as email, v.vendorpassword as password, 'vendor' as type FROM vendor v
      UNION
      SELECT c.customerid as id, c.customeremail as email, c.customerpassword as password, 'customer' as type FROM customer c
    ) AS t WHERE t.email = $1 AND t.password = $2`;
  const values = [req.body.params.email, req.body.params.password];

  return client.query(text, values, (err, response) => {
    if (err) {
      res.status(500).send(err.stack)
    } else {
      if (err) throw err
      if (response.rows[0] && (req.body.params.password == response.rows[0].password)) {
        res.json(response.rows[0]);
      } else {
        return res.status(401).send();
      }
    }
  });
});

router.get('/check-email/:email', (req, res) => {
  const text = `SELECT * FROM (
      SELECT v.vendorid as id, v.vendoremail as email, v.vendorpassword as password, 'vendor' as type FROM vendor v
      UNION
      SELECT c.customerid as id, c.customeremail as email, c.customerpassword as password, 'customer' as type FROM customer c
    ) AS t WHERE t.email = $1`;
  const values = [req.params.email];

  return client.query(text, values, (err, response) => {
    if (err) {
      res.status(500).send(err.stack)
    } else {
      if (err) throw err
      res.json(response.rows);
    }
  })
});

// Get List of Customers
router.get('/customer/list', (req, res) => {
  const text = 'SELECT * FROM customer';
  return client.query(text, (err, response) => {
    if (err) {
      res.status(500).send(err.stack)
    } else {
      if (err) throw err
      res.json(response.rows);
    }
  })
});

// POST customer
router.post('/customer/signup', (req, res) => {
  const body = req.body;
  checkZipcode(req.body.zipcode, req.body.city, req.body.state);

  const text = `INSERT INTO customer(customerid, customername, customeremail, customerpassword, customeraddress1, customeraddress2, customerphone, zipcode)
    VALUES((SELECT NULLIF(MAX(customerid) + 1, 1) FROM customer),$1, $2, $3, $4, $5, $6, $7)`;
  const values = [body.name, body.email, body.password, body.address1, body.address2, body.phone, body.zipcode];

  return client.query(text, values, (err, response) => {
    if (err) {
      console.log(err.stack);
      res.status(500).send(err.stack)
    } else {
      if (err) throw err
      res.json(response.rows[0]);
    }
  })
});

// GET Customer
router.get('/customer/:id', (req, res) => {
  const text = `SELECT * FROM customer c
    JOIN zip z on z.zipcode = c.zipcode
    WHERE customerId = $1`;
  const values = [req.params.id];

  return client.query(text, values, (err, response) => {
    if (err) {
      console.log(err.stack);
      res.status(500).send(err.stack)
    } else {
      if (err) throw err
      res.json(response.rows[0]);
    }
  })
});

router.get('/customer/:id/rewards', (req, res) => {
  const text = `UPDATE customer c SET rewardpoints = (SELECT SUM(ordertotal) FROM orders o WHERE o.customerid = $1) / 10 WHERE c.customerid = $1 RETURNING *;`;
  const values = [req.params.id];

  return client.query(text, values, (err, response) => {
    if (err) {
      console.log(err.stack);
      res.status(500).send(err.stack)
    } else {
      if (err) throw err
      res.json(response.rows[0]);
    }
  })
});

// PUT Customer
router.put('/customer/:id', (req, res) => {
  const body = req.body;
  checkZipcode(req.body.zipcode, req.body.city, req.body.state);
  const text = `UPDATE customer
    SET customername = $2, customeremail = $3, customerpassword = $4, customeraddress1 = $5, customeraddress2 = $6, customerphone = $7, zipcode = $8
    WHERE customerid = $1 RETURNING *`;
  const values = [body.customerid, body.customername, body.customeremail, body.customerpassword, body.customeraddress1, body.customeraddress2, body.customerphone, body.zipcode];

  return client.query(text, values, (err, response) => {
    if (err) {
      console.log(err.stack);
      res.status(500).send(err.stack)
    } else {
      if (err) throw err
      res.json(response.rows[0]);
    }
  })
});

// GET Customer Orders
router.get('/customer/:id/orders', (req, res) => {
  const text = `SELECT o.* FROM orders o
      JOIN customer c on o.customerid = c.customerid
      WHERE o.customerid = $1`;
  const values = [req.params.id];

  return client.query(text, values, (err, response) => {
    if (err) {
      console.log(err.stack);
      res.status(500).send(err.stack)
    } else {
      if (err) throw err
      res.json(response.rows);
    }
  })
});

// GET List of places to eat
router.get('/vendor/list', (req, res) => {
  const text = 'SELECT * FROM vendor v JOIN zip z on z.zipcode = v.zipcode';
  return client.query(text, (err, response) => {
    if (err) {
      console.log(err.stack);
      res.status(500).send(err.stack)
    } else {
      if (err) throw err
      res.json(response.rows);
    }
  })
});

// POST vendor signup
router.post('/vendor/signup', (req, res) => {
  const body = req.body;
  checkZipcode(req.body.zipcode, req.body.city, req.body.state);

  const text = `INSERT INTO vendor(vendorid, vendorname, vendoremail, vendorpassword, vendoraddress1, vendoraddress2, vendorphone, zipcode, cuisine, businesstype)
    VALUES((SELECT NULLIF(MAX(vendorid) + 1, 1) FROM vendor),$1, $2, $3, $4, $5, $6, $7, $8, $9)`;
  const values = [body.name, body.email, body.password, body.address1, body.address2, body.phone, body.zipcode, body.cuisine, body.businesstype];

  return client.query(text, values, (err, response) => {
    if (err) {
      console.log(err.stack);
      res.status(500).send(err.stack)
    } else {
      if (err) throw err
      res.json(response.rows[0]);
    }
  })
});

// GET Vendo Info
router.get('/vendor/:id', (req, res) => {
  const text = `SELECT * FROM vendor v
    JOIN zip z on z.zipcode = v.zipcode
    WHERE vendorid = $1`;
  const values = [req.params.id];

  return client.query(text, values, (err, response) => {
    if (err) {
      console.log(err.stack);
      res.status(500).send(err.stack)
    } else {
      if (err) throw err
      res.json(response.rows[0]);
    }
  })
});

// PUT Vendor Info
router.put('/vendor/:id', (req, res) => {
  const body = req.body;
  checkZipcode(req.body.zipcode, req.body.city, req.body.state);
  const text = `UPDATE vendor
    SET vendorname = $2, vendoremail = $3, vendorpassword = $4, vendoraddress1 = $5, vendoraddress2 = $6, vendorphone = $7, zipcode = $8, cuisine = $9, businesstype = $10
    WHERE vendorid = $1 RETURNING *`;
  const values = [body.vendorid, body.vendorname, body.vendoremail, body.vendorpassword, body.vendoraddress1, body.vendoraddress2, body.vendorphone, body.zipcode, body.cuisine, body.businesstype];

  return client.query(text, values, (err, response) => {
    if (err) {
      console.log(err.stack);
      return res.status(500).send(err.stack)
    } else {
      if (err) throw err
      return res.json(response.rows[0]);
    }
  })
});

// GET Vendor Orders
router.get('/vendor/:id/orders', (req, res) => {
  const text = `SELECT o.* FROM orders o
      JOIN vendor v on v.vendorid = o.vendorid
      WHERE o.vendorid = $1`;
  const values = [req.params.id];

  return client.query(text, values, (err, response) => {
    if (err) {
      console.log(err.stack);
      res.status(500).send(err.stack)
    } else {
      if (err) throw err
      res.json(response.rows);
    }
  })
});

// GET Vendor Menu
router.get('/vendor/:id/menu', (req, res) => {
  const text = `SELECT m.* FROM menu m
      JOIN vendor v on v.vendorid = m.vendorid
      WHERE m.vendorid = $1`;
  const values = [req.params.id];

  return client.query(text, values, (err, response) => {
    if (err) {
      console.log(err.stack);
      res.status(500).send(err.stack)
    } else {
      if (err) throw err
      res.json(response.rows);
    }
  })
});

// GET Vendor Drivers
router.get('/vendor/:id/drivers', (req, res) => {
  const text = `SELECT d.* FROM driver d
      JOIN vendor v on v.vendorid = d.vendorid
      WHERE v.vendorid = $1`;
  const values = [req.params.id];

  return client.query(text, values, (err, response) => {
    if (err) {
      console.log(err.stack);
      res.status(500).send(err.stack)
    } else {
      if (err) throw err
      res.json(response.rows);
    }
  })
});

// Menu
router.put('/menu/multiple', (req, res) => {
  const text = `SELECT m.* FROM menu m
      JOIN vendor v on v.vendorid = m.vendorid
      WHERE m.dishid IN ($1)`;
  const values = [req.body.keys];

  return client.query(text, values, (err, response) => {
    if (err) {
      console.log(err.stack);
      res.status(500).send(err.stack)
    } else {
      if (err) throw err
      res.json(response.rows);
    }
  })
});

router.put('/menu/:id', (req, res) => {
  const body = req.body;
  const text = `UPDATE menu
    SET dishname = $2, dishprice = $3, dishstatus = $4, vendorid = $5
    WHERE dishid = $1 RETURNING *`;
  const values = [req.params.id, body.dishname, body.dishprice, body.dishstatus, body.vendorid];

  return client.query(text, values, (err, response) => {
    if (err) {
      console.log(err.stack);
      return res.status(500).send(err.stack)
    } else {
      if (err) throw err
      return res.json(response.rows[0]);
    }
  })
});

router.post('/menu', (req, res) => {
  const body = req.body;
  const text = `INSERT INTO menu(dishid, dishname, dishprice, dishstatus, vendorid)
    VALUES((SELECT NULLIF(MAX(dishid) + 1, 1) FROM menu), $1, $2, $3, $4) RETURNING *`;
  const values = [body.dishname, body.dishprice, body.dishstatus, body.vendorid];

  return client.query(text, values, (err, response) => {
    if (err) {
      console.log(err.stack);
      return res.status(500).send(err.stack)
    } else {
      if (err) throw err
      return res.json(response.rows[0]);
    }
  })
});

router.delete('/menu/:id', (req, res) => {
  const text = `DELETE FROM menu WHERE dishid = $1`;
  const values = [req.params.id];

  return client.query(text, values, (err, response) => {
    if (err) {
      console.log(err.stack);
      return res.status(500).send(err.stack)
    } else {
      if (err) throw err
      return res.json(response.rows[0]);
    }
  })
});

// Driver
router.put('/driver/:id', (req, res) => {
  const body = req.body;
  const text = `UPDATE driver
    SET drivername = $2, driveremail = $3, driverphone = $4, drivervehicle = $5, vendorid = $6
    WHERE driverid = $1 RETURNING *`;
  const values = [req.params.id, body.drivername, body.driveremail, body.driverphone, body.drivervehicle, body.vendorid];

  return client.query(text, values, (err, response) => {
    if (err) {
      console.log(err.stack);
      return res.status(500).send(err.stack)
    } else {
      if (err) throw err
      return res.json(response.rows[0]);
    }
  })
});

router.post('/driver', (req, res) => {
  const body = req.body;
  const text = `INSERT INTO driver(driverid, drivername, driveremail, driverphone, drivervehicle, vendorid)
    VALUES((SELECT NULLIF(MAX(driverid) + 1, 1) FROM driver), $1, $2, $3, $4, $5) RETURNING *`;
  const values = [body.drivername, body.driveremail, body.driverphone, body.drivervehicle, body.vendorid];

  return client.query(text, values, (err, response) => {
    if (err) {
      console.log(err.stack);
      return res.status(500).send(err.stack)
    } else {
      if (err) throw err
      return res.json(response.rows[0]);
    }
  })
});

router.delete('/driver/:id', (req, res) => {
  const text = `DELETE FROM driver WHERE driverid = $1`;
  const values = [req.params.id];

  return client.query(text, values, (err, response) => {
    if (err) {
      console.log(err.stack);
      return res.status(500).send(err.stack)
    } else {
      if (err) throw err
      return res.json(response.rows[0]);
    }
  })
});

router.post('/order', (req, res) => {
  const order = req.body.main;
  const details = req.body.details

  const orderText = `INSERT INTO orders(orderid, customerid, vendorid, datecreated, ordertotal, driverid, deliverytype, orderstatus)
    VALUES(
      (SELECT NULLIF(MAX(orderid) + 1, 1) FROM orders),
      $1,
      $2,
      (SELECT DATE(NOW())),
      $3,
      (SELECT driverid FROM driver WHERE vendorid = 1 ORDER BY RANDOM() LIMIT 1),
      $4,
      $5
    ) RETURNING *`;
  const orderValues = [order.customerid, order.vendorid, order.ordertotal, order.deliverytype, 'NOT FULFILLED'];

  return client.query(orderText, orderValues, (err, response) => {
    if (err) {
      console.log(err.stack);
      return res.status(500).send(err.stack)
    } else {
      if (err) throw err
      Object.values(details).map(function(item, index) {
        const sql = `INSERT INTO orderdetails(orderid, dishid, quantity, amount) VALUES($1, $2, $3, $4)`;
        const values = [response.rows[0].orderid, item.dishid, item.qty, item.amount];

        return client.query(sql, values, function(err,result){
          if(err) console.log(err);
        });
      });
      return res.json(response.rows[0]);
    }
  })
});

router.get('/order/:id', (req, res) => {
  const text = `SELECT * FROM orders o
    WHERE o.orderid = $1`;
  const values = [req.params.id];

  return client.query(text, values, (err, response) => {
    if (err) {
      console.log(err.stack);
      res.status(500).send(err.stack)
    } else {
      if (err) throw err
      res.json(response.rows[0]);
    }
  })
});

router.get('/order/:id/items', (req, res) => {
  const text = `SELECT od.*, m.* FROM orderdetails od
    JOIN menu m on m.dishid = od.dishid
    WHERE od.orderid = $1`;
  const values = [req.params.id];

  return client.query(text, values, (err, response) => {
    if (err) {
      console.log(err.stack);
      res.status(500).send(err.stack)
    } else {
      if (err) throw err
      res.json(response.rows);
    }
  })
});

function checkZipcode(zipcode, city, state) {
  const text = `INSERT INTO zip VALUES ($1, $2, $3)
    ON CONFLICT (zipcode) DO UPDATE SET zipcode = $1 RETURNING *`;
  const values = [zipcode, city, state];

  return client.query(text, values, (err, response) => {
    if (err) throw err;
    return response.rows[0];
  });
}

module.exports = router;
