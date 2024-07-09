
const express = require('express');
const bodyParser = require('body-parser');
const sql = require('./database-config');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const cors = require('cors');
// const multer = require('multer');  //new
// const path = require('path');  //new
const app = express();
// const port = 3007;
app.use(cors());
const port = process.env.PORT || 8000;
//===========================
//new
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/images')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
//     }
// });

// const upload = multer({
//     storage: storage
// });
////////////////////////////////////////////
app.use(bodyParser.json());
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Express Server API",
            version: "0.0.1",
            description: "A simple express api with swagger"
        },
        host: "alreem-app22-43220fd1292e.herokuapp.com",
        basePath: '/',
        schemes: ['https']
    },
    servers: [{ url: `https://alreem-app22-43220fd1292e.herokuapp.com` }],
    apis: ['./server2.js']
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Get all product
 *     description: Returns a list of all product
 *     responses:
 *       200:
 *         description: A list of product
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Product'
 *   post:
 *     summary: Create a new product
 *     description: Creates a new product
 *     parameters:
 *       - in: body
 *         name: user
 *         description: The product to create
 *         schema:
 *           $ref: '#/definitions/Product'
 *     responses:
 *       201:
 *         description: product created successfully
 *
 * /api/product/{id}:
 *   get:
 *     summary: Get a product by ID
 *     description: Returns a single product by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: A single product
 *         schema:
 *           $ref: '#/definitions/Product'
 *   put:
 *     summary: Update a product
 *     description: Updates a product by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: The ID of the product
 *       - in: body
 *         name: product
 *         description: The product to update
 *         schema:
 *           $ref: '#/definitions/Product'
 *     responses:
 *       200:
 *         description: product updated successfully
 *   delete:
 *     summary: Delete a product
 *     description: Deletes a product by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: product deleted successfully
 * /api/productbycat/{categoryId}:
 *   get:
 *     summary: Get a product by categoryname
 *     description: Returns a single product by categoryname
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         type: integer
 *         description: The category of the product
 *     responses:
 *       200:
 *         description: A single product
 *         schema:
 *           $ref: '#/definitions/Product'
 *
 * definitions:
 *   Product:
 *     type: object
 *     properties:
 *       productId:
 *         type: integer
 *         example: 1
 *       productName:
 *         type: string
 *         example: perfume1
 *       description:
 *         type: string
 *         example: this is perfume1
 *       price:
 *         type: integer
 *         example: 12
 *       image:
 *         type: string
 *         example: This is image1
 *       categoryId:
 *         type: integer
 *         example: 1
 */
//================RESTful API ============================
// GET ALL
app.get('/api/product', async(req, res) => {
    try {
        const result = await sql.query("SELECT * FROM Product_Table");
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
//=============================================================
//GET specific
app.get('/api/product/:id', async(req, res) => { 
    try {
        const { id } = req.params;
        const result = await sql.query (`SELECT * FROM Product_Table WHERE ProductId= '${id}'`);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
//====================================================
// Insert
app.post('/api/product', async (req, res) => {
    try {
        const { productName, description, price, image, categoryId } = req.body;
        const result = await sql.query(`EXEC AddProduct_sp @productName='${productName}', @description='${description}', @price=${price}, @image='${image}', @categoryId=${categoryId}`);
        res.status(201).json({ user: result.recordset, message: 'Product has been created successfully!' });
    } catch (error) {
        res.status(500).send(error.message);
    }
});
//====================================================
// //update
app.put('/api/product/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const { productName, description, price, image, categoryId } = req.body;
        const result = await sql.query(`Exec UpdateProduct_sp  @productName= '${productName}',
        @description= '${description}', @price= ${price},@image= '${image}',
        @categoryId= ${categoryId}, @productId=${id}`);
        res.status(201).json({ user: result.recordset, message: 'Product has been modified Successfully!' });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// // Insert
// app.post('/api/product', upload.single('image'), async (req, res) => {
//     try {
//         const image = req.file.filename;
//         const { productName, description, price, categoryId } = req.body;
//         const result = await sql.query(`EXEC AddProduct_sp @productName='${productName}', @description='${description}', @price=${price}, @image='${image}', @categoryId=${categoryId}`);
//         res.status(201).json({ user: result.recordset, message: 'Product has been created successfully!' });
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });

// // // Update
// app.put('/api/product/:id', upload.single('image'), async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { productName, description, price, categoryId } = req.body;
//         let image = req.file ? req.file.filename : req.body.image;
//         const result = await sql.query(`Exec UpdateProduct_sp  @productName= '${productName}', @description= '${description}', @price= ${price}, @image= '${image}', @categoryId= ${categoryId}, @productId=${id}`);
//         res.status(201).json({ user: result.recordset, message: 'Product has been modified Successfully!' });
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });
//=====================================================
// //delete
app.delete('/api/product/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const result = await sql.query(`DELETE FROM Product_Table WHERE ProductId=${id}`);
        res.status(201).json({ user: result.recordset, message: 'Product has been removed Successfully!' });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/api/productbycat/:categoryId', async(req, res) => { 
    try {
        const {categoryId} = req.params;
        const result = await sql.query (`SELECT * FROM Product_Table WHERE CategoryId= ${categoryId}`);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on https://alreem-app22-43220fd1292e.herokuapp.com`);
    console.log(`Swagger UI is available on https://alreem-app22-43220fd1292e.herokuapp.com/api-ui`);
});
