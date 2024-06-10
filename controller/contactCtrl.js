import asyncHandler from "express-async-handler";
import validateMongoId from "../ulits/validateMongodbId.js";
import Contact from "../models/contactModel.js";


const createContact = asyncHandler(async(req,res)=>{
    try{
    const contact = await Contact.create(req.body)
    res.json(contact)
     }catch(err){
         throw new Error(err)
     }
 })


 const updateContact = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoId(id)
    try{
    const contact = await Contact.findByIdAndUpdate(id, req.body, {
        new: true
    })
    res.json(contact)
     }catch(err){
         throw new Error(err)
     }
 })


 const DeleteContact = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoId(id)
    try{
    const contact = await Contact.findByIdAndDelete(id, req.body)
    res.json(contact)
     }catch(err){
         throw new Error(err)
     }
 })

 const getSingleContact = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoId(id)
    try{
    const contact = await Contact.findById(id)
    res.json(contact)
     }catch(err){
         throw new Error(err)
     }
 })
 
 const getAllContact = asyncHandler(async(req,res)=>{
    try{
    const contact = await Contact.find()
    res.json(contact)
     }catch(err){
         throw new Error(err)
     }
 })
 export {
    createContact,
    DeleteContact,
    getSingleContact,
    getAllContact,
    updateContact
    
 }