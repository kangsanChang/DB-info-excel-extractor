const mysql = require('mysql');
const excel = require('xlsx');

/**
 * 
 * dbinfo 가 유일한 사용자 수정 부분
 * db 접속정보 및 조회 할 스키마 선택
 * 
 */

const dbinfo = {
    host: 'my_host',
    port: '3306',
    user: 'root',
    password: 'my_password',
    database: 'my_database',
    multiplestatements: true
}

const db = mysql.createConnection(dbinfo);

const sql = `SELECT
x.TABLE_NAME '테이블 명',
x.ORDINAL_POSITION '순번',
x.COLUMN_NAME '필드 명',
x.COLUMN_TYPE '데이터 타입',
x.COLUMN_KEY '키',
y.INDEX_NAME '인덱스 명',
x.IS_NULLABLE 'NULL 여부',
x.EXTRA '자동 여부',
x.COLUMN_DEFAULT '디폴트 값',
x.COLUMN_COMMENT '필드 설명'
FROM information_schema.COLUMNS x LEFT JOIN information_schema.STATISTICS y ON x.TABLE_NAME = y.TABLE_NAME AND x.COLUMN_NAME = y.COLUMN_NAME
WHERE x.TABLE_SCHEMA = '${dbinfo.database}'
ORDER BY x.TABLE_NAME, x.ORDINAL_POSITION;`

const wb = excel.utils.book_new();

db.query(sql, dbinfo.database, (err, results, field) => {
    const extractedByTableName = results.reduce((acc, cur) => {
        const tableName = cur['테이블 명'];
        
        if (acc[tableName] === undefined) {
            acc[tableName] = [];
        }

        acc[tableName].push(cur);
        return acc;
    }, {});
    
    for(const [key, value] of Object.entries(extractedByTableName)) {
        const ws = excel.utils.json_to_sheet(value);
        excel.utils.book_append_sheet(wb, ws, key);
    }
    excel.writeFile(wb, "result.xlsx");
    
    db.end();
});
