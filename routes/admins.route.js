import express from "express";
import authMiddleware from '.././middlewares/auth.middleware.js';
import notesService from '.././services/note.service.js';

const adminsRoute = express.Router();

adminsRoute.get('/admin/init',authMiddleware,
    async (req, res) => {
        await notesService.writeNotes();
    }
)

adminsRoute.get('/api/admin/user-stats/:user',authMiddleware,
    async (req,res)=>{
        let user = req.params.user
        res.json(await notesService.getAdminUserStats(user))
    }
)

export default adminsRoute;