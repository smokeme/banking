import { isAuthenticated } from "../services/helpers/auth.js";
import APIError from "./helpers/error.js";
import db from "../database.js";

const userCollection = db.collections.user;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */ 
/* DATA ABSTRACTION METHODS  
/*  Return an object: {
/*                      code: number 
/*                      data: payload or error as object
/*                    }     
/* CONTENTS                               
/* findDoc - finds a specific user
/* findAll - finds all users in the bank
/* findAllCustomerUsers - finds all users associated with a specific customer (ie a business)   
/* updateDoc - updates the user record in the database
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
export async function findDoc(query) {
  let result = {
    data: null,
    code: 200
  };

  // If there are no filters, return an error
  if (query == undefined) {
    result.code = 500;
    result.data = { error: { type: "db", message: "No query data provided to retrieve user." } };
    return result;
  }

  // Create filter
  const filter = {};
  const options = ["username", "email", "id", "_id"];
  for (let i = 0; i < options.length; i++) {
    if (query.hasOwnProperty(options[i])) {
      filter[options[i]] = query[options[i]];
      break;
    }
  }

  // Search for doc in database
  try {
    result.data = await userCollection.findOne(filter);
    result.code = result.data == null ? 500 : 200;
  } catch (e) {
    result.code = 500;
    result.data = { error: { type: "db", message: "Database error.", data: e } };
  }
  return result;
}

export async function findAll(auth_token) {
  if (isAuthenticated(auth_token)) {
    
  }
}

export async function findAllCustomerUsers(auth_token) {
  if (isAuthenticated(auth_token)) {
    
  }
}

export async function updateDoc(filter, updates, options) {
  let result = {
    code: 200,
    data: null
  }
  try {
    const response = await userCollection.findOneAndUpdate(filter, { $set: {...updates } }, options);
    result.data = response;
  } catch (e) {
    result.code = 500;
    result.data = { error: { type: "db", message: "Database error.", data: e } };
  
  }
  return result;
}

export async function deleteDoc(filter) {
  let result = {
    code: 200,
    data: null
  }
  result.data = await userCollection.deleteOne(filter);
  return result;
}

export async function getRequestedUser(requestedID, response) {

  let requestedUser;
  let error = null;
  try {
    const result2 = await findDoc({ id: requestedID });
    if (result2.code !== 200) {
      APIError.authorization(response);
      return result2.data;
    }
    requestedUser = result2.data;
  } catch (e) {
    error = e;
  }
  if (error) {
    console.log(error);
  } 
  return requestedUser;
}

export async function checkPermissions({ response, config, requestingUser, requestedUser }) {

  if (typeof requestingUser == "undefined" || requestingUser == null) {
    APIError.db(response);
    return false;
  }
  if (typeof requestedUser == "undefined" || requestedUser == null) {
    APIError.db(response);
    return false;
  }
  for (let i = 0; i < config.length; i++) {
    const test = config[i];
    const result = await test(requestingUser, requestedUser);
    if (result == true) {
      return true;
    }
  }

  APIError.authorization(response);
  return false;
};