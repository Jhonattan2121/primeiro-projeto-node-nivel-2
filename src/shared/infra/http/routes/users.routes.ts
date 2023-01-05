import {  Router } from "express";

import multer from "multer";
import uploadConfig from "../config/upload";

import CreateUserService from "../services/CreateUserService";
import UpdateUSerAvatarService from "../modules/users/services/UpdateUserAvatarService";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const usersRouter = Router(); // Agendar 
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
 
  const {name, email, password} = request.body;

  const createUser = new CreateUserService();

  const user = await createUser.execute({
    name,
    email,
    password,
  });

    delete user.password;

    return response.json(user)
 
});
 
usersRouter.patch('/avatar', 
ensureAuthenticated,
upload.single('avatar'), 
async (request , response) => {
  
    const updateUSerAvatar = new UpdateUSerAvatarService();
   const user =  await updateUSerAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    })

    delete user.password;

    return response.json(user);

},

);

export default usersRouter;
