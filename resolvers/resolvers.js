const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

const resolvers = {
    Query: {
        login: async (_, {usernameOrEmail, password}) => {
            const user = await User.findOne({
                $or: [{username: usernameOrEmail}, {email: usernameOrEmail }]
            });
            if (!user) throw new Error('User does not exist');

            const valid = await bcrypt.compare(password, user.password);
            if(!valid) throw new Error('Invalid password');

            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn:'1d'});
            return {token, user};
        },

        getAllEmployees: async () => {
            return await Employee.find();
        },

        searchEmployeeById: async (_,{eid}) => {
            const emp = await Employee.findById(eid);
            if (!emp) throw new Error('Employee not found');
            return emp;
        },

        searchEmployeeByDesignationOrDepartment: async (_, { designation, department }) => {
            const query = {};
            if (designation) query.designation = designation;
            if (department)  query.department = department;
            return await Employee.find(query);
        }
    },

    Mutation: {

        signup: async (_, { username, email, password }) => {
            const existing = await User.findOne({ $or: [{ username }, { email }] });
            if (existing) throw new Error('Username or email already in use');
            const user = new User({ username, email, password });
            await user.save(); // password gets hashed by the pre-save hook
            return user;
        },


        addEmployee: async (_, args) => {
            if (args.salary < 1000) throw new Error('Salary must be at least 1000');
            const existing = await Employee.findOne({ email: args.email });
            if (existing) throw new Error('Email already in use');
            const employee = new Employee(args);
            await employee.save();
            return employee;
        },


        updateEmployee: async (_, { eid, ...updates }) => {
            const employee = await Employee.findByIdAndUpdate(
                eid,
                { ...updates, updated_at: new Date() },
                { new: true } // return the updated document
            );
            if (!employee) throw new Error('Employee not found');
            return employee;
        },


        deleteEmployee: async (_, { eid }) => {
            const result = await Employee.findByIdAndDelete(eid);
            if (!result) throw new Error('Employee not found');
            return `Employee ${eid} deleted successfully`;
        }
    }
};

module.exports = resolvers;
