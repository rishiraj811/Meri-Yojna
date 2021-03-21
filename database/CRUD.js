const
      Scheme = require('../database/models/Scheme'),
      User = require('../database/models/User'),
      Question = require('../database/models/Question'),
      Configuration = require('../database/models/Configuration');

router = require('express').Router()
module.exports = router


//Global Settings Updation
router.put('/global',  async (req,res) => {
      try{
            settings = (await GlobalSettings.find())[0]
            await settings.updateOne(req.body)
            res.status(200).send("Successfully updated the global settings")
      }
      catch (e) {
            res.status(400).json(e)
      }
})

//Configuration Database CRUD
router.get('/config', async (req,res) => {
      try{
            res.status(200).send(await Configuration.find(req.body))
      }
      catch (e) {
            res.status(400).json(e)
      }
})

router.post('/config',  async (req,res) => {
      try{
            await(new Configuration(req.body).save())
            res.status(200).send("Successfully added configuration named "+req.body.name)
      }
      catch (e) {
            res.status(400).json(e)
      }
})

router.put('/config', async (req,res) => {
      try{
            config = await Configuration.findOne({_id:req.body._id})
            await config.updateOne(req.body)
            res.status(200).send("Successfully updated configuration named "+req.body.name)
      }
      catch (e) {
            res.status(400).json(e)
      }
})

router.delete('/config', async (req,res) => {
      try{
            name = await Configuration.findOne({_id:req.body._id}).name
            await Question.deleteOne({_id:req.body._id})
            res.status(200).send("Successfully deleted configuration named "+name)
      }
      catch (e) {
            res.status(400).json(e)
      }
})

//Question Database CRUD
router.get('/question', async (req,res) => {
      try{
            res.status(200).send(await Question.find(req.body))
      }
      catch (e) {
            res.status(400).json(e)
      }
})

router.post('/question',  async (req,res) => {
      try{
            await(new Question(req.body).save())
            res.status(200).send("Successfully added question named "+req.body.name)
      }
      catch (e) {
            res.status(400).json(e)
      }
})

router.put('/question', async (req,res) => {
      try{
            question = await Question.findOne({_id: req.body._id})
            await question.updateOne(req.body)
            res.status(200).send("Successfully updated question named "+req.body.name)
      }
      catch (e) {
            res.status(400).json(e)
      }
})

router.delete('/question', async (req,res) => {
      try{
            name = (await Question.findOne({_id: req.body._id})).name
            await Question.deleteOne({_id: req.body._id})
            res.status(200).send("Successfully deleted question named "+name)
      }
      catch (e) {
            res.status(400).json(e)
      }
})

//Scheme Database CRUD
router.get('/scheme', async (req,res) => {
      try{
            res.status(200).send(await Scheme.find(req.body))
      }
      catch (e) {
            res.status(400).json(e)
      }
})

router.post('/scheme',  async (req,res) => {
      try{
            await(new Scheme(req.body).save())
            res.status(200).send("Successfully added scheme named "+req.body.name)
      }
      catch (e) {
            res.status(400).json(e)
      }
})

router.put('/scheme', async (req,res) => {
      try{
            scheme = await Scheme.findOne({_id: req.body._id})
            await scheme.updateOne(req.body)
            res.status(200).send("Successfully updated scheme named "+req.body.name)
      }
      catch (e) {
            res.status(400).json(e)
      }
})

router.delete('/scheme', async (req,res) => {
      try{
            name = (await Scheme.findOne({_id: req.body._id})).name
            await Scheme.deleteOne({_id: req.body._id})
            res.status(200).send("Successfully deleted scheme named "+name)
      }
      catch (e) {
            res.status(400).json(e)
      }
})
