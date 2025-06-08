// partner
const { resolve } = require("path");
const { pool } = require("../../config/db");
const UniversityStorage = require("./universityStorage");

class PartnerStorage{
    // unversity_url 입력받아 university_id 보내기
    static getUniversityID(university_url){
        return new Promise(async (resolve,reject)=> {

            // db에서 요청쿼리 존재하는지 확인
            const listResponse = await UniversityStorage.getUniversityNameList();
            const found = listResponse.result.find(u => u.university_url === university_url);
            if (!found) {
                //console.log("university_url: ", university_url);
                return resolve({ success: false, status: 404, message: '해당 university_url이 존재하지 않습니다.' });
            }

            pool.getConnection((err,connection)=>{
                if(err){
                    console.error('MySQL 연결 오류: ',err);
                    reject(err)
                }
                pool.query("SELECT university_id FROM university WHERE university_url=?;",[university_url],function(err,rows){
                    connection.release();
                    if (err) {
                        console.error('Query 함수 오류', err);
                        return reject(err); // 쿼리 실패
                    }
                    //console.log("university_url: ", university_url);
                    //console.log("mysql result: ", rows[0]);
                    //console.log("unversity_url 입력받아 university_id 보내기\n", rows);

                    if (rows.length === 0) {
                        const noResultError = new Error('해당 university_url이 존재하지 않습니다.');
                        console.warn(noResultError.message);
                        return reject(noResultError); // 결과 없음도 오류로 처리
                    }

                    resolve(rows[0].university_id);
                });
            });     
        });
    }
    // university_url로 university_name받아오기
    static getUniversityName(university_url) {
        return new Promise(async (resolve,reject)=> {

            // db에서 요청쿼리 존재하는지 확인
            const listResponse = await UniversityStorage.getUniversityNameList();
            const found = listResponse.result.find(u => u.university_url === university_url);
            if (!found) {
                //console.log("university_url: ", university_url);
                return resolve({ success: false, status: 404, message: '해당 university_url이 존재하지 않습니다.' });
            }

            pool.getConnection((err,connection)=>{
                if(err){
                    console.error('MySQL 연결 오류: ',err);
                    return reject(err)
                }
                pool.query('SELECT university_name FROM university WHERE university_url =?',[university_url],(err,data)=>{
                    connection.release();
                    if(err){
                        console.error('Query 함수 오류',err);
                        return reject(err)
                    }
                    //console.log("university_url: ", university_url);
                    //console.log("university_url로 university_name받아오기\n", data);

                    if (data.length === 0) {
                        const noResultError = new Error('해당 university_url이 존재하지 않습니다.');
                        console.warn(noResultError.message);
                        return reject(noResultError); // 결과 없음도 오류로 처리
                    }

                    resolve(data[0]);
                });
            });     
        });
    }
    // university_id로 해당 대학의 제휴 가게 모두 뽑아내기

    // University 중심좌표 받아오기
    static async getUniversityLocation(university_url){ 
        return new Promise(async(resolve,reject)=>{

            // db에서 요청쿼리 존재하는지 확인
            const listResponse = await UniversityStorage.getUniversityNameList();
            const found = listResponse.result.find(u => u.university_url === university_url);
            if (!found) {
                //console.log("university_url: ", university_url);
                return resolve({ success: false, status: 404, message: '해당 university_url이 존재하지 않습니다.' });
            }

            pool.getConnection((err,connection)=>{
                if(err){
                    console.error('MySQL 연결 오류: ',err);
                    reject(err);
                }
                pool.query("SELECT latitude, longitude FROM university WHERE university_url=?;",[university_url],function(err,rows){
                    connection.release();
                    if(err){
                        console.error('Query 오류',err);
                        return reject(err);
                    }

                    //console.log("university_url: ", university_url);
                    //console.log("University 중심좌표 받아오기\n", rows);

                    if (rows.length === 0) {
                        const noResultError = new Error('해당 university_url이 존재하지 않습니다.');
                        console.warn(noResultError.message);
                        return reject(noResultError); // 결과 없음도 오류로 처리
                    }
                    
                    resolve(rows[0]);
                })
            });
        })    
    }
    // unversity_name 입력받아 university_id 보내기
    static getUniversityID_name(university_name){
        return new Promise(async(resolve,reject)=>{

            // db에서 요청쿼리 존재하는지 확인
            const listResponse = await UniversityStorage.getUniversityNameList();
            const found = listResponse.result.find(u => u.university_name === university_name);
            if (!found) {
                //console.log("university_url: ", university_url);
                return resolve({ success: false, status: 404, message: '해당 university_name 존재하지 않습니다.' });
            }

            pool.getConnection((err,connection)=>{
                if(err){
                    console.error('MySQL 연결 오류: ',err);
                    reject(err);
                }
                pool.query("SELECT university_id FROM university WHERE university_name=?;",[university_name],function(err,rows){
                    connection.release();
                    if(err){
                        console.error('Query 오류',err);
                        return reject(err);
                    }

                    //console.log("university_url: ", university_name);
                    //console.log("unversity_name 입력받아 university_id 보내기\n", rows);
                    
                    if (rows.length === 0) {
                        const noResultError = new Error('해당 university_url이 존재하지 않습니다.');
                        console.warn(noResultError.message);
                        return reject(noResultError); // 결과 없음도 오류로 처리
                    }
                    
                    resolve(rows[0].university_id);
                })  
            });     
        })
    }
    // 제휴가게 등록하기

    // 제휴가게 삭제하기

};

module.exports = PartnerStorage;

