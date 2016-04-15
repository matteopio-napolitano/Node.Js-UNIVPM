module.exports = function (sequelize, DataTypes) {

    var Document = sequelize.define('Document', {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        fs_name: {type: DataTypes.STRING, allowNull: false},
        user_id: {type: DataTypes.INTEGER, allowNull: false}
    }, {
        freezeTableName: true, // Model tableName will be the same as the model name
        classMethods: {
            associate: function (models) {
                
            }
        }
    });

    return Document;
};