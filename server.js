const express = require('express');
const bodyParser = require('body-parser');
const sql = require('./database-config');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const cors = require('cors');
const app = express();
const port = 3005;
app.use(cors());
//===========================
app.use(bodyParser.json());
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Express Server API",
            version: "0.0.1",
            description: "A simple express api with swagger"
        },
        // host: "localhost:3005",
        host: "alreem-app-a1759fa6576e.herokuapp.com",
        basePath: '/',
        schemes: ['http']
    },
    servers: [{ url: `http://alreem-app-a1759fa6576e.herokuapp.com` }],
    apis: ['./server.js']
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of all users
 *     responses:
 *       200:
 *         description: A list of users
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/User'
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user
 *     parameters:
 *       - in: body
 *         name: user
 *         description: The user to create
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Returns a single user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: A single user
 *         schema:
 *           $ref: '#/definitions/User'
 *   put:
 *     summary: Update a user
 *     description: Updates a user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: The ID of the user
 *       - in: body
 *         name: user
 *         description: The user to update
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: User deleted successfully
 *
 * /api/users/{email}/{password}:
 *   get:
 *     summary: Get a user by email and password
 *     description: Returns a single user by email and name
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         type: string
 *         description: The email of the user
 *       - name: password
 *         in: path
 *         required: true
 *         type: string
 *         description: The password
 *     responses:
 *       200:
 *         description: A single user
 *         schema:
 *           $ref: '#/definitions/User'
 *
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *         example: alreem
 *       email:
 *         type: string
 *         example: alreem@example.com
 *       password:
 *         type: string
 *         example: 32434ghhjrgew
 */
//================RESTful API ============================
// GET ALL
app.get('/api/users', async(req, res) => {
    try {
        const result = await sql.query("SELECT * FROM User_Table");
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
//=============================================================
app.get('/api/users/:email/:password', async(req, res) => {
    try {
        const { email, password } = req.params;
        const result = await sql.query(`exec Login_sp @email='${email}' , @password='${password}'`);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
//==============================================================
//GET specific
app.get('/api/users/:id', async(req, res) => { 
    try {
        const { id } = req.params;
        const result = await sql.query (`SELECT * FROM User_Table WHERE UserId= '${id}'`);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// // Insert
app.post('/api/users', async(req, res) => {
    try {
        const { name, email, password } = req.body;
        const result = await sql.query(`Exec Register_sp @name='${name}', @email='${email}', @password='${password}'`);
        res.status(201).json({ user: result.recordset, message: 'User has been created Successfully!' });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// //update
app.put('/api/users/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password} = req.body;
        const result = await sql.query(`UPDATE User_Table SET Name= '${name}',
         Email= '${email}',Password= (CONVERT(VARCHAR(50), HASHBYTES('SHA2_256','${password}'), 2)) WHERE UserId=${id}`);
        res.status(201).json({ user: result.recordset, message: 'User has been modified Successfully!' });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// //delete
app.delete('/api/users/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const result = await sql.query(`DELETE FROM User_Table WHERE UserId=${id}`);
        res.status(201).json({ user: result.recordset, message: 'User has been removed Successfully!' });
    } catch (error) {
        res.status(500).send(error.message);
    }
});



app.listen(port, () => {
    console.log(`Server is running on http://alreem-app-a1759fa6576e.herokuapp.com`);
    console.log(`Swagger UI is available on http://alreem-app-a1759fa6576e.herokuapp.com/api-ui`);
});
