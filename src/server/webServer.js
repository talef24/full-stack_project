const productsData = require('../db/persist');
const express = require('express');
const sessionMw = require("./middlewares/session");
const corsMw = require("./middlewares/cors");
const app = express();
const port = process.env.PORT || 3001;
const productsDAO = require('../server/dao/products');
const generalDAO = require('../server/dao/general');
const inputValidationController = require('./middlewares/inputValidation');
const userAuthRouter = require('./routes/userAuthRouter');
const authenticateMw = require("./middlewares/authenticate");
const userDataRouter = require('./routes/userDataRouter');
const userOperationsRouter = require('./routes/userOperationsRouter');
const productsRouter = require('./routes/productsRouter');
const adminAuthenticateMw = require("./middlewares/adminAuthenticate");
const adminRouter = require('./routes/adminRouter');
const apiErrorHandler = require('../server/error/apiErrorHandler');

app.use(express.json());

//Setup CORS logic:
app.options("*", corsMw);
app.use(corsMw);

app.use(sessionMw);

app.use(inputValidationController);
app.use('/', userAuthRouter);
app.use(authenticateMw);
app.use('/', userDataRouter);
app.use('/', userOperationsRouter);
app.use('/', productsRouter);
app.use(adminAuthenticateMw);
app.use('/', adminRouter);
app.use(apiErrorHandler); //Error handler must be the last
//If no end-point found - automatically sends 404-not found

//Start server:
app.listen(port, () => {
    console.log(`server start listening on port: ${port}`);
});

//*************************************Insert products data to db*************************************
productsDAO.initProducts("boxes", productsData.boxesData);
productsDAO.initProducts("items", productsData.itemsData);
productsDAO.initProducts("packages", productsData.packagesData);
//*************************************Insert admin*************************************
generalDAO.insertAdmins().then();
