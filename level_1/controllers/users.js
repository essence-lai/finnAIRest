import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { users } from '../schemas/users.js';

//[GET][users]: returns all users
export const getUsers = (req, res) => res.send(users);

//[GET][users][id] Returns a spectific user of id
export const getUser = (req, res) => {
    const { id } = req.params;

    const foundUser = users.find((user) => user.id === id);
    if (_.isEmpty(foundUser))  return res.status(404).send(`[GET][users][${id}] User ${id} Not Found`);
    res.send(foundUser);
};

//[POST][users] creates a user
export const createUser = (req, res) => {
    try{ 
        const user = req.body,
        { fName, lName, age } = user,
        id = uuidv4();

        if (!_.isString(fName) || !_.isString(lName) || !_.isNumber(age)) throw 'Bad Inputfname:String, lname:String, age:Integer';

        users.push({ id, fName, lName, age });

        res.send(`Successfully added user ${ user.fName } ${ user.lName }`);
        
    } catch (e) {
        res.status(400).send(`Bad Request ${e}`);
    }
};

//[DELETE][users][id] deletes a user
export const deleteUser = (req,res) => {
    const { id } = req.params,
     removedUsers = _.remove(users, (user) => user.id === id);

    if (_.isEmpty(removedUsers))return res.status(404).send(`[GET][users][${id}] User ${id} Not Found`);

    res.send(`[DELETE][users][${id}] ${removedUsers[0].fName } ${ removedUsers[0].lName } removed`);
};