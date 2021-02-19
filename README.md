# DB-info-excel-extractor

테이블 정의서 생성기
입력한 DB 스키마의 각 Table 정보를 sheet 별로 가지는 엑셀파일을 만들어 준다.

## Require
nodejs

## 사용방법 

1. install modules
```bash
npm i
```

2. extracor.js 파일의 dbinfo 수정
```javascript
const dbinfo = {
    host: 'my_host',
    port: '3306',
    user: 'root',
    password: 'my_password',
    database: 'my_database',
    multiplestatements: true
}
```

3. 실행
```bash
node extractor.js
```
