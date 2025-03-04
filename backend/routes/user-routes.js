import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js' 
import { getUsers, getUserById, createUser, deleteUser, updateUser, loginUser, getUserWithToken } from '../controllers/user-controller.js'

const usersRouter = express.Router()

usersRouter.route('/user').get(async (req, res) => {
    const result = await getUsers();

    if (result.error) {
        return res.status(400).json({ message: result.message });
    }

    return res.status(200).json(result);
})

usersRouter.route('/user').post(async (req, res) => {
    const result = await createUser(req.body);

    if (result.error) {
        return res.status(400).json({ message: result.message });
    }

    return res.status(200).json(result);
})

usersRouter.route('/user/:id').get(authMiddleware, async (req, res) => {
    const result = await getUserById(req.params.id)
    if (result.error) {
        return res.status(400).json({ message: result.message });
    }

    return res.status(200).json(result);
})

usersRouter.route('/user/:id').delete(authMiddleware, async (req, res) => {
    const result = await deleteUser(req.params.id)
    if (result.error) {
        return res.status(400).json({ message: result.message });
    }

    return res.status(200).json(result);
})

usersRouter.route('/user/:id').put(authMiddleware, async (req, res) => {
    const result = await updateUser(req.params.id, req.body);
    if (result.error) {
        return res.status(400).json({ message: result.message });
    }

    return res.status(200).json(result);
})

usersRouter.route('/login').post(async (req, res) => {
    const result = await loginUser(req.body.username, req.body.password);

    if (result.error) {
        return res.status(400).json({ message: result.message });
    }

    return res.status(200).json(result);
})

usersRouter.route('/token').get(authMiddleware,  async (req, res) => {
    const user = req.user;
    return res.status(200).json(user);
    // const result = await getUserWithToken(req.headers.authorization.split(" ")[1]);
    // if (result.error) {
    //     return res.status(400).json({ message: result.message });
    // }

    // return res.status(200).json(result);
})

export default usersRouter;