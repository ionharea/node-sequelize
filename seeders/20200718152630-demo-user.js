'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('Users',
      [{
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '02342343224',
        userName:'username',
        password: 'password',
        email: 'example@example.com',
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        firstName: 'Rely',
        lastName: 'Daren',
        phoneNumber: '089393424324',
        userName:'bobbi12',
        password: 'password12',
        email: 'example@12121go.com',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }])
  },
  down: async (queryInterface, Sequelize) => {

    return queryInterface.bulkDelete('Admins', null, {});
  }
};
