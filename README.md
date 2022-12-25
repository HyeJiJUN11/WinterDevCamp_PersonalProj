# URL Shortener
Smilegate 2022 WinterDevCamp Personal Project<br>

<br>

**사용 기술 스택**
*   html/CSS
*   node.js
*   mySQL

<br>

**API**
*  /inputlongurl<br>
    long URL 입력 받을 시,<br>
    db에 있으면 short URL가져옴. <br>
    db에 없으면 short short URL만들어서 db update
*  /:shorturl<br>
    주소창에 short URL입력시,<br>
    db에서 long URL 가져와 redirect

<br>

**DB**


*   database : 'urlshortener'
*   table : 'links'<br>
indexnum int pk<br>
longurl varchr(2000)<br>
shorturl varchar(8)<br>
