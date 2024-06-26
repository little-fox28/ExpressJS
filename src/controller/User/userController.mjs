import {promises as fs} from 'fs';

import mockUsers from "../../Database/MockUser.mjs";
import UUID from "../../utils/UUID.mjs";
import {validationResult} from "express-validator";

export async function createUser(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {name, email, password} = req.body;
    const foundUser = FoundUser({email});

    if (foundUser) {
        return res.status(409).json({message: "User already exists"});
    }

    const newUser = await CreateUser(name, email, password)

    return res.status(201).json(newUser);
}

export function getAllUser(req, res) {
    return res.status(200).json(mockUsers);
}

export function getUserByName(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {name} = req.body;
    const foundUser = FoundUser({name});

    if (!foundUser || foundUser.length === 0) {
        return res.status(401).json({message: "User not found"});
    }

    return res.status(200).json(foundUser);
}

export function getUserByID(req, res) {
    const {findUserIndex} = req;

    const foundUser = mockUsers[findUserIndex]

    if (!foundUser) {
        return res.status(401).json({message: "User not found"});
    }

    return res.status(200).json(foundUser);
}

export function updateUserByID(req, res) {
    const {body, findUserIndex} = req;

    const updatedUser = {...mockUsers[findUserIndex], ...body};
    mockUsers[findUserIndex] = updatedUser;

    return res.status(200).json(updatedUser);
}

export function deleteUser(req, res) {
    const {findUserIndex} = req;

    if (findUserIndex === -1) {
        return res.status(404).json({message: "User not found"});
    }

    const [deletedUser] = mockUsers.splice(findUserIndex, 1);

    return res.status(200).json(deletedUser);
}


export function FoundUser({name = null, email = null, password = null} = {}) {
    return mockUsers.find(
        user =>
            (name !== null && user.name === name) ||
            (email !== null && user.email === email) ||
            (password !== null && user.password === password)
    );
}

export async function CreateUser(name, email, password) {
    try {
        const newUser = {id: UUID(), name, email, password};
        mockUsers.push(newUser)

        await fs.writeFile('src/Database/data.json', JSON.stringify(mockUsers, null, 2), "utf8");
    } catch (error) {
        console.error('Error adding user:', error.message);
    }
}