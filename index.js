var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var app = express();

const KeyVault = require('azure-keyvault');
const msRestAzure = require('ms-rest-azure');

var credentials = msRestAzure.loginWithAppServiceMSI({resource: 'https://vault.azure.net'});
const keyVaultClient = new KeyVault.KeyVaultClient(credentials);

app.get('/', function(req, res){
    res.render('form');
 });
 
 app.set('view engine', 'pug');
 app.set('views', './views');
 
 // for parsing application/json
 app.use(bodyParser.json()); 
 
 // for parsing application/xwww-
 app.use(bodyParser.urlencoded({ extended: true })); 
 //form-urlencoded
 
 // for parsing multipart/form-data
 app.use(upload.array()); 
 app.use(express.static('public'));
 
 app.post('/', function(req, res){
    console.log(req.body);
    var vaultUri = "https://" + req.body.keyVault + ".vault.azure.net/";
    var secret = keyVaultClient.getSecret(vaultUri, req.body.secretName, "");

    res.send("Your secret is: " + secret);
 });

 app.listen(443);
