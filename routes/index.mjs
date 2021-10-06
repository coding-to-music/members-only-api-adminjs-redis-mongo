import express from "express";

const router = express.Router();

router.get('/', (req, res) => res.redirect('/api'));

export default router