const { Mock } = require('./common');

let database = Mock.mock({
    'data|100': [
        {
            id: '@id',
            'status|1-2': 1,
            title: '@title',
            author: '@clast',
            categories: '@word',
            tags: '@word',
            'views|10-200': 1,
            'comments|10-200': 1,
            visibility: () => {
                return Mock.mock('@pick(["Public", "Password protected", "Private"])');
            },
            date: '@dateTime',
            image() {
                return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.author.substr(0, 1));
            }
        }
    ]
}).data;

module.exports = {
    testData: database
}