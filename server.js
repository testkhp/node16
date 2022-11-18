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
app.get("/boardtest",async (req,res)=>{
    //query string으로 보내줌 데이터값 받는 방법
    // console.log(req.query.page);
    //사용자가 게시판에 접속시 몇번 페이징 번호로 접속했는지 체크
    let pageNumber = (req.query.page == null) ? 1 : Number(req.query.page);
    //한 페이지당 보여줄 데이터 갯수
    let perPage = 2;
    //블록당 보여줄 페이징 번호 갯수
    let blockCount = 3;
    //현재 페이지 블록 구하기
    let blockNum = Math.ceil(pageNumber / blockCount);
    //블록안에 있는 페이징의 시작번호 값을 알아내자
    let blockStart = ((blockNum - 1) * blockCount) + 1;
    //블록안에 있는 페이징의 끝 번호 값을 알아내자
    let blockEnd = blockStart + blockCount - 1;

    //데이터베이스 콜렉션에 있는 전체 객체의 갯수값 가져오는 명령어
    let totalData = await db.collection("board").countDocuments({});
    //전체 데이터값을 통해서 -> 몇개의 페이징 번호가 만들어져야 하는지 계산
    let paging = Math.ceil(totalData / perPage);
    //블록에서 마지막 번호가 페이징의 끝번호보다 크다면 페이징의 끝번호를 강제로 부여
    if(blockEnd > paging){
        blockEnd = paging;
    }
    //블록의 총 갯수 구하기
    let totalBlock = Math.ceil(paging / blockCount);
    //데이터베이스에서 꺼내오는 데이터의 시작 순번값을 결정
    let startFrom = (pageNumber - 1) * perPage

    //데이터베이스 콜렉션에서 데이터값을 두개씩 순번에 맞춰서 가져오기
    // sort({정렬할프로퍼티명:1}) 오름차순  -1은 내림차순
    // 조건문을 이용해서 입력한 검색어가 있는 경우는 aggregate({}).sort().skip().limit()

    db.collection("board").find({}).sort({number:-1}).skip(startFrom).limit(perPage).toArray((err,result)=>{
        res.render("board",{prdData:result,
                            paging:paging,
                            pageNumber:pageNumber,
                            blockStart:blockStart,
                            blockEnd:blockEnd,
                            blockNum:blockNum,
                            totalBlock:totalBlock});
    });
    //board.ejs에 전달해줘야할 데이터들
    /*1. board 콜렉션에서 가지고온 데이터값 result
      2. 페이징 번호의 총 갯수값 paging
      3. 몇번 페이징을 보고있는지 번호값 pageNumber
      4. 블록안에 페이징 시작하는 번호값 blockStart
      5. 블록안에 페이징 끝나는 번호값 blockEnd
      6. 블록 번호 순서값 blockNum
      7. 블록 총갯수 totalBlock
    */
});