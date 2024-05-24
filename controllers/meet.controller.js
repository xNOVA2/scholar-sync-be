import { generateResponse, asyncHandler } from "../utils/helpers.js";
import fs from "fs";
import path from "path";
import process from "process";
import { authenticate } from "@google-cloud/local-auth";
import { auth } from "google-auth-library";
import { SpacesServiceClient, } from "@google-apps/meet";
import { createSessionRequest } from "../models/request.model.js";
import { findMeetSession } from "../models/session.model.js";

const SCOPES = ["https://www.googleapis.com/auth/meetings.space.created"];
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

// Function to load saved credentials if they exist
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.promises.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return auth.fromJSON(credentials);
    } catch (err) {
        console.log(err);
        return null;
    }
}

// Function to save credentials
async function saveCredentials(client) {
    const content = await fs.promises.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({

        type: "authorized_user",
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.promises.writeFile(TOKEN_PATH, payload);
}

// Function to authorize the client
async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    
    if (!client) {
        client = await authenticate({
            
            scopes: SCOPES,
            keyfilePath: CREDENTIALS_PATH,
        });
        if (client.credentials) {
            await saveCredentials(client);
        }
    }
    return client;
}

export const createSession = asyncHandler(async (req, res, next) => {
    const authClient = await authorize();
    
    const meetClient = new SpacesServiceClient({
        authClient: authClient,
        
    });
    const response =  await meetClient.createSpace({
        space:{
          config:{
            accessType:"OPEN"
          },
        }
    })

    if(!response) return next({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: 'Cannot create session try again'
    })

    // req.body.meetUrl = response[0].meetingUri;
    // const data = await createSessionRequest({...req.body,})
    return response[0].meetingUri;
});

export const findMeetSessions = asyncHandler(async (req, res, next) => {
    const teacher = req.query.teacher || false;
    const student = req.query.student || false;
    const query = {}

    if(teacher){
        query.teacher = req.user.id
    }
    if(student){
        query.student = req.user.id
    }
    const data = await findMeetSession(query)
    generateResponse(data, 'Meet session fetched successfully', res);
})