"use strict";

const University = require('./university/university');
const bcrypt = require('bcrypt');

const UserStorage = require("./userStorage");
const { response } = require('express');
class User {
    constructor(body) {
        this.body = body;
    }

    //client_email 통해 user정보 갖고오기 
    async getUserInfo(client_email) {
        try {
            const userInfo = await UserStorage.getUserInfo(client_email);
            if (userInfo) {
                const university = new University();
                return {
                    loginStatus: true,
                    user_email: userInfo.user_email,
                    psword: userInfo.psword,
                    user_type: userInfo.user_type,
                    user_name: userInfo.user_name,
                    user_nickname: userInfo.user_nickname,
                    university_id: userInfo.university_id,
                    university_url: await university.getUnversityIdToUrl(userInfo.university_id),
                    //university_id가 아닌 university_name으로 반환해줌
                    university_name: await university.getUnversityIdToName(userInfo.university_id)
                };
            }
            return { loginStatus: false }
        } catch (err) {
            return {
                result: false,
                status: 400,
                err: err
            };
        }
    }

    //회원가입 
    async register() {
        try {
            const client = this.body;
            const response = await UserStorage.save(client);
            return response;
        } catch (err) {
            return {
                result: false,
                status: 400,
                err: err
            };
        }

    }
    //닉네임 변경
    async modifyNickname() {
        try {
            const client = this.body;
            const response = await UserStorage.updateNickname(client);
            return response;
        } catch (err) {
            return {
                result: false,
                status: 400,
                err: err
            };
        }

    }
    //비밀번호 변경1(마이페이지-현재 비밀번호를 아는 상태로 비밀번호 변경)
    async modifyPsword1() {
        try {
            const client = this.body;
            let userInfo = await UserStorage.getUserInfo(client.user_email);

            if (await bcrypt.compare(client.psword, userInfo.psword)) {
                const response = await UserStorage.updatePsword(client);
                return response;
            } else {
                return {
                    result: false,
                    status: 400,
                    err: `비밀번호가 틀렸습니다.`
                }
            }
        } catch (err) {
            return {
                result: false,
                status: 400,
                err: err
            };
        }

    }
    //비밀번호 변경2(이메일을 이용한 비밀번호 변경)
    async modifyPsword2() {
        try {
            const client = this.body;
            const response = await UserStorage.updatePsword(client);
            return response;
        
        } catch (err) {
            return {
                result: false,
                status: 400,
                err: err
            };
        }

    }


    //회원 탈퇴
    async withdrawalUser() {
        try {
            const client = this.body;
            let userInfo = await UserStorage.getUserInfo(client.user_email);

            if (await bcrypt.compare(client.psword, userInfo.psword)) {
                const response = await UserStorage.deleteUser(client);
                return response;
            } else {
                return {
                    result: false,
                    status: 400,
                    err: `비밀번호가 틀렸습니다.`
                }
            }
        } catch (err) {
            return {
                result: false,
                status: 400,
                err: `${err}`
            };
        }

    }
    //이메일 중복 확인
    async duplicateCheckEmail() {
        try {
            const client = this.body;
            const userInfo = await UserStorage.getUserInfo(client.user_email);

            //console.log(userInfo);

            if (userInfo) { //유저 정보 여부 반환
                return {  result:false, status: 200, msg: "존재하는 이메일입니다." };
            } else {
                //유저 정보 반환하지 못했을 경우
                return {  result:true, msg: "사용가능한 이메일입니다.", status: 200 }
            }
        } catch (err) {
            return { result: false, msg: "서버와 연결이 실패했습니다.", status: 400, err: `${err}` }
        }
    }

    // 유저 정보 반환
    async userInfo() {
        try {
            const client = this.body;
            const userInfo = await UserStorage.getUserInfo(client.user_email);

            //console.log(userInfo);

            if (userInfo) {
                return { result: userInfo, status: 200 };
            } else {
                return { result: null, status: 404, msg: "사용자를 찾을 수 없습니다." };
            }
        } catch (err) {
            return { result: false, msg: "서버와 연결이 실패했습니다.", status: 400, err: `${err}` }
        }
    }


    //refresh토큰 저장
    async saveRefreshToken(user_email, token, expiresAt) {
        try {

            const response = await UserStorage.saveRefreshToken(user_email, token, expiresAt);
            return response;
        } catch (err) {
            return {
                result: false,
                status: 400,
                err: err
            };
        }
    }

    // 토큰으로 조회
  async getRefreshTokenByToken(token) {
    try {
      const tokenInfo = await UserStorage.getRefreshTokenByToken(token);
      return tokenInfo;
    } catch (err) {
      return {
        result: false,
        status: 400,
        err: err
      };
    }
  }

  // 이메일로 조회
  async getRefreshTokenByEmail(email) {
    try {
      const tokenInfo = await UserStorage.getRefreshTokenByEmail(email);
      return tokenInfo;
    } catch (err) {
      return {
        result: false,
        status: 400,
        err: err
      };
    }
  }

  // 로그아웃용 토큰 삭제
  async deleteRefreshToken(token) {
    try {
      const result = await UserStorage.deleteRefreshToken(token);
      return result;
    } catch (err) {
      return {
        result: false,
        status: 400,
        err: err
      };
    }
  }

  async deleteRefreshTokenByEmail(email) {
    try {
    return await UserStorage.deleteRefreshTokenByEmail(email);
    } catch (err) {
    return {
        result: false,
        status: 400,
        err: err
    };
    }
}
}


module.exports = User