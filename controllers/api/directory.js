const router = require("express").Router();
require("dotenv").config();
const { Person, Address } = require("../../models");
const { isLoggedIn, hasProfile } = require("../../utils/auth");
const multer = require("multer");

const { upload } = require("../../config/multer");

router.get("/", isLoggedIn, async (req, res) => {
  try {
    const { rows } = await Person.getAll();

    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

router.post("/", hasProfile, async (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.json({ error: "File too large! Must be under 1MB" });
    } else if (err) {
      return res.json({ error: err.message });
    }

    const imgPath = req.file.path.replace("public", "");
    const newPersonEnrty = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone: req.body.phone,
      github_id: req.user.github_id,
      avatar: imgPath,
    };
    const personsAddress = {
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
    };
    const { rows } = await Person.create(newPersonEnrty);

    await Address.create({
      ...personsAddress,
      person_id: rows[0].id,
    });
    req.login(newPersonEnrty, () => {
      res.status(200).json({ message: "Success" });
    });
  });
});

module.exports = router;
