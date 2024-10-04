const mongoose = require('mongoose');
const Todo = require('./models/Todo');
const arr = [
    {
      task: "Work to do",
      isComp: true,
    },
    {
      task: "Gym to go",
      isComp: false,
    },
    {
      task: "sleeping 8 hours",
      isComp: false,
    },
    {
      task: "study 10 hours",
      isComp: true,
    },
    {
      task: "study 10 hours",
      isComp: false,
    },
    {
      task: "gaming 10 hours",
      isComp: true,
    },
  ];

  async function seedDB() {
    await Todo.deleteMany({});
    await Todo.insertMany(arr);
    console.log("DB Seeded Successfully");
  }
  module.exports = seedDB;