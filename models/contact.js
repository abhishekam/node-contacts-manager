module.exports = function(sequelize, DataTypes){
    return sequelize.define('contact',{
        'name':{
            type: DataTypes.STRING,
            validate:{
                notEmpty: true,
                len:[2,49]
            }
        },
        'organization':{
            type: DataTypes.STRING
        },
        'mobile':{
            type: DataTypes.STRING,
            validate:{
                isMobilePhone:['en-IN']

            }
        }
    });
};
