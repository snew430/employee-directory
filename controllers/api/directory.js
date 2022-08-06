const router = require("express").Router();
require("dotenv").config();
const { Person, Address } = require("../../models");
const { isLoggedIn, hasProfile } = require("../../utils/auth");
const multer = require("multer");
const { decrypt, encrypt } = require("../../utils/crypto");

const { upload } = require("../../config/multer");

router.get("/", isLoggedIn, async (req, res) => {
  try {
    const { rows } = await Person.getAll();
    let decryptedRows = rows.map((person) => {
      return {
        ...person,
        street: decrypt(person.street),
        city: decrypt(person.city),
        state: decrypt(person.state),
      };
    });
    res.status(200).json(decryptedRows);
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
      street: encrypt(req.body.street),
      city: encrypt(req.body.city),
      state: encrypt(req.body.state),
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
