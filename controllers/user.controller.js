const Userdb = require("../models/user.model");
const UserTokendb = require("../models/userToken.model");
const controllerName = "user.controller";
const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");
const sendErrorResponse = require("../utils/sendErrorResponse.util");
const sendSuccessResponse = require("../utils/sendSuccessResponse.util");
const verifyArgumentExistence = require("../utils/verifyArgumentExistence");
const { v4: uuidv4 } = require("uuid");
const Roledb = require("../models/role.model");
const Clientdb = require("../models/client.model");
const Employedb = require("../models/employe.model");
const Managerdb = require("../models/manager.model");

exports.getUser = (req, res) => {
  const functionName = "getUser";
  try {
    const { id } = req.params;

    verifyArgumentExistence(["id"], req.params);

    Userdb.find({_id: id, isDeleted: false })
      .populate("role")
      .then((data) => {
        sendSuccessResponse(res, data ? data[0] : null, controllerName, functionName);
      })
      .catch((err) => {
        sendErrorResponse(res, err, controllerName, functionName);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName);
  }
};

exports.getListeUser = (req, res) => {
  const functionName = "getListeUser";
  try {
    Userdb.find({ isDeleted: false })
      .populate("role")
      .then((data) => {
        sendSuccessResponse(res, data, controllerName, functionName);
      })
      .catch((err) => {
        sendErrorResponse(res, err, controllerName, functionName);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName);
  }
};

exports.addUser = async (req, res) => {
  const functionName = "addUser";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { email, password, role, confirmPassword } = req.body;

    verifyArgumentExistence(
      ["email", "password", "role", "confirmPassword"],
      req.body
    );

    if ((password && !confirmPassword) || (!password && confirmPassword)) {
      throw new Error("Veillez remplir les champs de mot de passe");
    }
    if (confirmPassword && confirmPassword !== password) {
      throw new Error("Les mots de passes ne correspondent pas");
    }

    const newData = {
      email: email,
      password: bcrypt.hashSync(password, 10),
      role: new ObjectId(role),
    };

    const dataToInsert = new Userdb(newData);
    dataToInsert
      .save({ session })
      .then(async (data) => {
        sendSuccessResponse(res, data, controllerName, functionName, session);
      })
      .catch((err) => {
        sendErrorResponse(res, err, controllerName, functionName, session);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName, session);
  }
};

exports.updateUser = async (req, res) => {
  const functionName = "updateUser";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const { email, password, role, confirmPassword } = req.body;

    verifyArgumentExistence(["id"], req.params);
    verifyArgumentExistence(
      ["email", "password", "role", "confirmPassword"],
      req.body
    );

    if ((password && !confirmPassword) || (!password && confirmPassword)) {
      throw new Error("Veillez remplir les champs de mot de passe");
    }
    if (confirmPassword && password !== confirmPassword) {
      throw new Error("Les mots de passes ne correspondent pas");
    }

    const newData = {
      email: email,
      password: bcrypt.hashSync(password, 10),
      role: new ObjectId(role),
    };
    Userdb.findByIdAndUpdate(new ObjectId(id), newData, {
      session,
    })
      .then(async (data) => {
        sendSuccessResponse(res, data, controllerName, functionName, session);
      })
      .catch(async (err) => {
        sendErrorResponse(res, err, controllerName, functionName, session);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName, session);
  }
};

exports.deleteUser = async (req, res) => {
  const functionName = "deleteUser";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;

    verifyArgumentExistence(["id"], req.params);

    Userdb.findByIdAndUpdate(new ObjectId(id), { isDeleted: true }, { session })
      .then(async (data) => {
        sendSuccessResponse(res, data, controllerName, functionName, session);
      })
      .catch(async (err) => {
        sendErrorResponse(res, err, controllerName, functionName, session);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName, session);
  }
};

exports.login = async (req, res) => {
  const functionName = "login";
  try {
    const { email, password } = req.body;
    verifyArgumentExistence(["email", "password"], req.body);

    Userdb.find({ email: email })
      .populate("role")
      .then(async (data) => {
        if (data.length > 0) {
          const user = data[0];
          const verifPassword = bcrypt.compareSync(password, user.password);

          if (verifPassword) {
            // console.log("Mot de passe correct");

            let expired_at = new Date();
            expired_at.setDate(expired_at.getDate() + 3);

            let currentDate = new Date().getTime();
            // console.log(`${currentDate}${uuidv4()}`);

            let token = bcrypt.hashSync(`${currentDate}${uuidv4()}`, 10);
            token = token.replace(/\//g, '0');

            const dataToInsert = new UserTokendb({
              user: user._id,
              token: token,
              expired_at: expired_at,
            });

            let userInformation = {};
            let user_id = "";
            
            if(user.role.nomRole=="Client"){
              let temp = await Clientdb.findOne({user:user._id});
              // console.log(temp);
              user_id = temp._id;
            }
            if(user.role.nomRole=="Employe"){
              let temp = await Employedb.findOne({user:user._id});
              user_id = temp._id;
            }
            if(user.role.nomRole=="Manager"){
              let temp = await Managerdb.findOne({user:user._id});
              user_id = temp._id;
            }

            dataToInsert
              .save()
              .then(async (userToken) => {

                sendSuccessResponse(
                  res,
                  { email: user.email, token: dataToInsert.token, role: user.role.nomRole, user_id: user_id },
                  controllerName,
                  functionName
                );

              })
              .catch((err) => {
                sendErrorResponse(res, err, controllerName, functionName);
              });
          } else {
            //   console.log("Mot de passe incorrect");
            const errorMessage = new Error(`Email or Password incorrect`);
            sendErrorResponse(res, errorMessage, controllerName, functionName);
          }
        } else {
          const errorMessage = new Error(
            `Username/Email or Password incorrect`
          );
          sendErrorResponse(res, errorMessage, controllerName, functionName);
        }
      })
      .catch((err) => {
        sendErrorResponse(res, err, controllerName, functionName);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName);
  }
};

exports.verifyUserToken = async (req, res) => {
  const functionName = "verifyUserToken";
  try {
    const { token } = req.body;
    verifyArgumentExistence(["token"], req.body);

    UserTokendb.find({ token: token, expired_at: { $gte: new Date() }, isDeleted: false })
      .then((data) => {
        if (data.length > 0) {
          sendSuccessResponse(res, true, controllerName, functionName);
        } else {
          sendSuccessResponse(res, false, controllerName, functionName);
        }
      })
      .catch((err) => {
        sendErrorResponse(res, err, controllerName, functionName);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName);
  }
};

exports.deleteUserToken = async (req, res) => {
  const functionName = "deleteUserToken";
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { token } = req.params;
    verifyArgumentExistence(["token"], req.params);

    UserTokendb.findOneAndUpdate({ token: token, isDeleted: true }, { session })
      .then(async (data) => {
        sendSuccessResponse(res, data, controllerName, functionName, session);
      })
      .catch(async (err) => {
        sendErrorResponse(res, err, controllerName, functionName, session);
      });
  } catch (err) {
    sendErrorResponse(res, err, controllerName, functionName, session);
  }
};

exports.logout = async (req, res) => {
  const functionName = "logout";
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { token } = req.body;
    verifyArgumentExistence(["token"], req.body);
    UserTokendb.findOneAndUpdate({ token: token, isDeleted: true }, { session })
      .then(async (data) => {
        sendSuccessResponse(res, data, controllerName, functionName, session);
      })
      .catch(async (err) => {
        sendErrorResponse(res, err, controllerName, functionName, session);
      });
  }
  catch (err) {
    sendErrorResponse(res, err, controllerName, functionName, session);
  }
}