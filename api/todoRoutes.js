const express = require('express');
const router = express.Router();
const todo = require('../models/Todo');
const user = require('../models/Users');

router.get('/todos', async (req, res)=>{
    try {
        let data = await todo.find({});
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json({msg: "something went wrong", err: err})
    }
})

router.get('/todo/:userId/todos', async (req, res)=>{
    try {
        let {userId} = req.params;
        let data = await user.findById(userId).populate('todos');
        // console.log(data.todos);
        res.status(200).json(data.todos);
    } catch (err) {
        res.status(400).json({msg: "something went wrong", err: err})
    }
})

router.post('/todo/:userId/addtodo', async (req, res)=>{
    try {
        let {userId} = req.params;
        let {task, isComp, owner, dueDate} = req.body;
        let currUser = await user.findById(userId);
        const todoData = new todo({task, isComp, owner, dueDate});
        currUser.todos.push(todoData);
        await todoData.save();
        await currUser.save();
        res.status(201).json({msg: 'Todo Created', data: todoData});
    } catch (err) {
        res.status(400).json({msg: "something went wrong", err: err})
    }
})

router.patch('/todo/:id', async (req, res)=>{
    try {
        let {task, isComp} = req.body;
        let {id} = req.params;
        await todo.findByIdAndUpdate(id, {task, isComp});
        res.status(201).json({msg: 'Todo Updated'});
    } catch (err) {
        res.status(400).json({msg: "something went wrong", err: err})
    }
})

router.delete('/todo/:userId/:todoId', async (req, res)=>{
    try {
        let {userId, todoId} = req.params;
        let currUser = await user.findById(userId);
        currUser.todos = currUser.todos.filter((item)=>item._id!=todoId);
        currUser.save();
        await todo.findByIdAndDelete(todoId);

        //console.log(currUser); 
        res.status(201).json({msg: 'Todo Deleted'});
    } catch (err) {
        res.status(400).json({msg: "something went wrong", err: err})
    }
})

router.get('/todo/:id', async (req, res)=>{
    try {
        let {id} = req.params;
        let item = await todo.findById(id);
        res.status(200).json(item);
    } catch (err) {
        res.status(400).json({msg: "something went wrong", err: err})
    }
})



module.exports=router