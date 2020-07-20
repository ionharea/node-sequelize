'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
  
    await queryInterface.bulkInsert('Articles', 
    [
      {
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean quis euismod diam, eu blandit turpis. Morbi vel suscipit velit. ',
        userId: 1    
      },
      {
        content: 'Aliquam egestas lacinia dui a ornare. Curabitur eu lacus a orci posuere maximus.',
        userId: 2    
      },
      {
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean quis euismod diam, eu blandit turpis. ',
        userId: 1    
      },
      {
        content: 'Aliquam vulputate lorem non ultricies rhoncus. Quisque dignissim pretium velit, sagittis facilisis tellus.',
        userId: 2    
      },
      {
        content: 'In cursus congue lorem vel consectetur. Sed at felis quam. Sed tristique commodo magna sed aliquam. Sed id nibh nec arcu aliquam vulputate sed quis leo. Aliquam ultricies non urna volutpat blandit.',
        userId: 1    

      },
      {
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean quis euismod diam, eu blandit turpis.',
        userId: 2    
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
   
    await queryInterface.bulkDelete('Articles', null, {});
  }
};
