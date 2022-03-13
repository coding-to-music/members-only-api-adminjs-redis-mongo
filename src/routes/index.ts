import express from "express";

const router = express.Router();

router.get('/', (req, res) => res.redirect('/v1'));

export default router