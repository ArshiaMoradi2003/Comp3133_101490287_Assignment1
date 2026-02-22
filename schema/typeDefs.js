const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # --- Types (shape of data returned) ---
  type User {
    _id: ID
    username: String
    email: String
    created_at: String
    updated_at: String
  }

  type Employee {
    _id: ID
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: String
    department: String
    employee_photo: String
  }

  type AuthPayload {
    token: String
    user: User
  }

  # --- Queries (READ operations) ---
  type Query {
    login(usernameOrEmail: String!, password: String!): AuthPayload
    getAllEmployees: [Employee]
    searchEmployeeById(eid: ID!): Employee
    searchEmployeeByDesignationOrDepartment(designation: String, department: String): [Employee]
  }

  # --- Mutations (CREATE/UPDATE/DELETE operations) ---
  type Mutation {
    signup(username: String!, email: String!, password: String!): User
    addEmployee(
      first_name: String!
      last_name: String!
      email: String!
      gender: String
      designation: String!
      salary: Float!
      date_of_joining: String!
      department: String!
      employee_photo: String
    ): Employee
    updateEmployee(
      eid: ID!
      first_name: String
      last_name: String
      email: String
      gender: String
      designation: String
      salary: Float
      date_of_joining: String
      department: String
      employee_photo: String
    ): Employee
    deleteEmployee(eid: ID!): String
  }
`;

module.exports = typeDefs;