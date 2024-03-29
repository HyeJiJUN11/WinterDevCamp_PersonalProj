const http = require('http');
const mysql = require('mysql2');
const fs = require('fs');
const ejs = require('ejs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const accountDB = mysql.createConnection({
    host : '127.0.0.1',
    user : 'root',
    password : '*',
    database : 'urlshortener'
});

accountDB.connect();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
});

//url입력시
app.post('/inputlongurl', function(req, res){
    var longurl = req.body.longurl;

    fs.readFile(__dirname + '/static/index.html', 'utf8', function(error,data){
        if (error) throw error;

        var short; //shorturl

        //입력된 값 db에서 찾음
        accountDB.query(`SELECT shorturl FROM links WHERE longurl = '${longurl}';`, (error, result) => {
            if (error) throw error;

            //db에 없는 값이면
            if (result == ""){
                //db에 longurl 넣고
                accountDB.query(`INSERT INTO links(longurl) VALUES ('${longurl}');`, (error) => {
                    if (error) throw error;
                })
                
                var num; //indexnum
                //indexnum 가져옴
                accountDB.query(`SELECT indexnum FROM links WHERE longurl = '${longurl}';`, (error, result) => {
                    if (error) throw error;

                    num = result[0].indexnum;
                    var shorturl = makeshorturl(num); //shorturl만드는 함수
                
                //db에 shorturl update                    
                    accountDB.query(`UPDATE links SET shorturl = '${shorturl}' WHERE longurl = '${longurl}';`, (error) => {
                    if (error) throw error;
                })

                //만든 shroturl 보여줌
                short = 'http://127.0.0.1:3000/' + shorturl;
                res.render('result.ejs', { shorturl : short });
                
                })                
            }

            //있으면 db에서 가져옴
            else{
                short = 'http://127.0.0.1:3000/' + result[0].shorturl;
                res.render('result.ejs', { shorturl : short });
            }
        })
    })
})

//short url 입력시 원래 페이지로 redirect
app.get('/:shorturl', (req, res) => {
    var shorturl = req.params.shorturl;
    accountDB.query(`SELECT longurl FROM links WHERE shorturl = '${shorturl}';`, (error, result) => {
        if (error) throw error;
        
        else{
            res.redirect(result[0].longurl);
        }
    })
});

//index로 단축된 url생성
function makeshorturl(num) {
    if (num === 0) {
        return '0';
    }
    
    var digits = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var shorturl = ''; 

    while (num > 0) {
        shorturl = digits[num % digits.length] + shorturl;
        num = parseInt(num / digits.length, 10);
    }

    var len = shorturl.length
    if(len<8){
        for(var i=0; i<8-len; i++){
            shorturl = '0' + shorturl;
        }
    }

    return shorturl;
  }

app.listen(3000)
