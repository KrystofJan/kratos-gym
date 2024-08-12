const wrkOutPlanService = require("../Services/PlanPresetService");
const userService = require("../Services/UserService");
const PlanModel = require("../ORM/Models/PlanPreset");
const UserModel = require("../ORM/Models/User");

const getId = async (req, res, id) => {
  try {
    const wrkOutPlan = await wrkOutPlanService.getId(id);

    const authorData = awarService.getId(wrkOutPlan.AuthorId);
    const author = new UserModel(authorData);

    const model = new PlanModel(wrkOutPlan);
    model.author = author.constructJson();

    res.status(200).json(model.constructJson(wrkOutPlan));
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAll = async (req, res) => {
  try {
    const wrkOutPlan = await wrkOutPlanService.getAll();

    const results = [];

    for (const b of wrkOutPlan) {
      const a = new PlanModel(b);
      const authorData = await userService.getId(b.AuthorId);

      const author = new UserModel(authorData);
      a.author = author.constructJson();
      results.push(a.constructJson(b));
    }

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json(err);
  }
};

const post = async (req, res) => {
  try {
    const body = req.body;

    if (Array.isArray(body)) {
      for (const record of body) {
        const result = await wrkOutPlanService.post(record);
      }
      res.status(201).json({ status: "All" });
    } else {
      const result = await wrkOutPlanService.post(body);
      res.status(201).json(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  getId,
  getAll,
  post,
};
