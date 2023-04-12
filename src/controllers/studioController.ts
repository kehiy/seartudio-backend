import DB from "../databases";
import jwt from "jsonwebtoken";
import messageEnum from "../enums/messageEnum";
import { apiResponse } from "utils/apiRespones";
import sharp from "sharp";
import fs from "fs";
import bcrypt from "bcrypt";

const Studio = DB.Studio;


export const addStudio = async (req, res) => {
    const { studioId, name, phoneNumber,
        address, province, type, license,
        pricePerHour, openingHours, email, stId,
        description, passWord } = req.body;

    const {logo,image} = req.file;


}