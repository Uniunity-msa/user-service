"use strict";

const PartnerStorage = require("./partnerStorage");

class Partner{
    async getUniversityID(university_url){
        try{
            const response = await PartnerStorage.getUniversityID(university_url);
            return response;
        }catch(err){
            return{success:false,msg:err};
        }
    }
    async getUniversityName(university_url){
        try{
            const response = await PartnerStorage.getUniversityName(university_url);
            return response;
        }catch(err){
            return{success:false,msg:err};
        }
    }
    async getUniversityLocation(university_url){
        try{
            const response = await PartnerStorage.getUniversityLocation(university_url);
            return response;
        }catch(err){
            return{success:false,msg:err};
        }
    }
    //async getPartnerStores(university_id){
    
    async showUniversity(university_url){
        try{
            const response = await PartnerStorage.getUniversity(university_url);
            return response;
        }catch(err){
            return{success:false,msg:err};
        }
    }
    async getUniversityID_name(university_name){
        try{
            const response = await PartnerStorage.getUniversityID_name(university_name);
            return response;
        }catch(err){
            return{success:false,msg:err};
        }
    }
    //async uploadPartnerStore(partner_name, content, start_period, end_period, address, university_id, latitude, longitude){

    //async DeletePartnerStore(partner_id){
};

module.exports = Partner;
