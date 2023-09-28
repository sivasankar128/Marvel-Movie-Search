const express = require("express");
const request = require('request');
const app = express();
const port =3000;
const passwordhash = require('password-hash');
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore ,Filter} = require("firebase-admin/firestore");

var serviceAccount = require("./key12.json");
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
app.set("view engine", "ejs");
///////////////////////////
var data=[];
db.collection("SIGNUP")
.get()
.then((docs) => {
  docs.forEach((doc) => {
    data.push(doc.data());
  });
})
  app.get("/login", (req, res) => {
    res.render("login");
  });
/////////////////////////////
//LOGIN
app.get("/loginsubmit", (req, res) => {
  const email = req.query.Email;

  db.collection("SIGNUP")
  .where("email", "==", email)
  .get()
  .then((docs) => {
    
      let result = false;
      docs.forEach((doc) => {
        const hashp = doc.data().password;
        result = passwordhash.verify(req.query.password, hashp);
      if (result) {
        if(email=="sivasankaravula128@gmail.com" && req.query.password==123456){
          res.render("home",{userData:data});
          }
          else{
            res.render("index");
          }
      } else {
        res.render("loginfailed")
      }
    })
})
})  
app.get("/logfailed", (req, res) => {
  res.render("login");
});
  
//SIGNUP
  app.get("/signup",(req,res)=>{
    res.render("signup");
  });

  app.get("/signupsubmit", (req, res) => {
    const user_name = req.query.username;
    const email = req.query.Email;
    const password = req.query.password;
    const phonenumber = req.query.phno;
      db.collection("SIGNUP").
      where("email","==",email)
        .get()
        .then((docs)=>{
          if(docs.size>0){
            res.render("signup failed");
          }
          else{
            db.collection("SIGNUP")
              .where("name","==",user_name)
              .get()
              .then((docs)=>{
                if(docs.size>0){
                  res.render("signup failed");
                }
                else{
                  db.collection("SIGNUP")
                  .add({
                    name: user_name,
                    email: email,
                    password: passwordhash.generate(password), 
                    phonenumber: phonenumber
                  })
                  .then(() => {
                    res.render("login");
                  })
                  .catch(()=>{
                    res.send("SIGNUP FAILED.. PLEASE TRY AGAIN");
                  })
                }
              })
          }
        })
    });
    app.get("/sigfailed", (req, res) => {
      res.render("signup");
    });

  app.get('/main', (req, res) => {
    res.render("index");
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });