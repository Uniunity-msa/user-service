// partner
const { resolve } = require("path");
const { pool } = require("../../config/db");

class PartnerStorage{
    // unversity_url 입력받아 university_id 보내기
    static getUniversityID(university_url){
        return new Promise(async (resolve,reject)=> {
            pool.getConnection((err,connection)=>{
                if(err){
                    console.error('MySQL 연결 오류: ',err);
                    reject(err)
                }
                pool.query("SELECT university_id FROM university WHERE university_url=?;",[university_url],function(err,rows){
                    connection.release();
                    if (err) {
                        console.error('Query 함수 오류', err);
                        reject(err);
                        return;
                    }
                    if (rows.length === 0) {
                    console.warn(`해당 university_url에 대한 결과 없음: ${university_url}`);
                    resolve(null); // 혹은 reject(new Error("Not found"))
                    return;
                }
                resolve(rows[0].university_id);
                });
            });     
        });
    }
    // university_url로 university_name받아오기
    static getUniversityName(university_url) {
        return new Promise(async (resolve,reject)=> {
            pool.getConnection((err,connection)=>{
                if(err){
                    console.error('MySQL 연결 오류: ',err);
                    reject(err)
                }
                pool.query('SELECT university_name FROM university WHERE university_url =?',[university_url],(err,data)=>{
                    connection.release();
                    if(err){
                        console.error('Query 함수 오류',err);
                        reject(err)
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
            pool.getConnection((err,connection)=>{
                if(err){
                    console.error('MySQL 연결 오류: ',err);
                    reject(err);
                }
                pool.query("SELECT latitude, longitude FROM university WHERE university_url=?;",[university_url],function(err,rows){
                    connection.release();
                    if(err){
                        console.error('Query 오류',err);
                        reject(err);
                    }
                    resolve(rows[0]);
                })
            });
        })    
    }
    // unversity_url 입력받아 university_id 보내기
    static getUniversityID_name(university_name){
        return new Promise(async(resolve,reject)=>{
            pool.getConnection((err,connection)=>{
                if(err){
                    console.error('MySQL 연결 오류: ',err);
                    reject(err);
                }
                pool.query("SELECT university_id FROM university WHERE university_name=?;",[university_name],function(err,rows){
                    connection.release();
                    if(err){
                        console.error('Query 오류',err);
                        reject(err);
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

