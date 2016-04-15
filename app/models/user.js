module.exports = function (sequelize, DataTypes) {
    
    var User = sequelize.define('User', {
        email: {type: DataTypes.STRING, allowNull: false, unique: true},
        password: {type: DataTypes.STRING, allowNull: false, unique: true},
        fname: DataTypes.STRING,
        lname: DataTypes.STRING
    }, {
        freezeTableName: true, // Model tableName will be the same as the model name
        classMethods: {
            associate: function (models) {
                
            }
        }
    });

    return User;
};