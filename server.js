const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const app = express();
const port = process.env.PORT || 8080;
app.set("view engine","ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

MongoClient.connect("mongodb+srv://admin:qwer1234@port2.ackae9r.mongodb.net/?retryWrites=true&w=majority",function(err,result){
    //에러가 발생했을경우 메세지 출력(선택사항)
    if(err) { return console.log(err); }

    //위에서 만든 db변수에 최종연결 ()안에는 mongodb atlas 사이트에서 생성한 데이터베이스 이름
    db = result.db("port2");

    //db연결이 제대로 됬다면 서버실행
    app.listen(port,function(){
        console.log("서버연결 성공");
    });

});

//게시판 화면 get 요청
app.get("/boardtest",(req,res)=>{
    
});