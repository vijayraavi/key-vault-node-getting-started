var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var app = express();
import {SecretClient} from "@azure/keyvault-secrets";

app.get('/', function(req, res){
    res.render('form');
 });
 
 app.set('view engine', 'pug');
 app.set('views', './views');

 app.use(express.urlencoded());
 
 // for parsing multipart/form-data
 app.use(upload.array()); 
 app.use(express.static('public'));
 
 app.post('/', function(req, res){
   console.log(req.body);
   //const KeyVault = require('azure-keyvault');
   const msRestAzure = require('ms-rest-azure');
   msRestAzure.loginWithAppServiceMSI({resource: 'https://vault.azure.net'}, function(err, credentials){
      if(err){
         console.log("Login Error" + err);
      }
      else{
         console.log("no err");
         console.log("credential msiApiVersion " + credentials.msiApiVersion);
         console.log("credential msiEndpoint " + credentials.msiEndpoint);
         console.log("credential msiSecret " + credentials.msiSecret);
         console.log("credential resource " + credentials.resource);
         var vaultUri = "https://" + req.body.keyVault + ".vault.azure.net/";
         console.log("vaultUri is " + vaultUri);
         console.log("secret name is " + req.body.secretName);
         //var keyVaultClient = new KeyVault.KeyVaultClient(credentials);
         const client = new SecretClient(vaultUri, credentials);
         var secret = await client.getSecret(req.body.secretName);
         console.log("result is " + secret);
         res.send("Your secret is: " + secret);
         //keyVaultClient.getSecret(vaultUri, req.body.secretName, "").then((result) => {
         //   console.log("result is " + result);
         //   res.send("Your secret is: " + result);
         //})
      }
   });
   
 });

 const port = process.env.PORT || 1337;
 app.listen(port, () => console.log("Server is running on port" + port));
