const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

class User extends Model {
    async comparePassword(candidatePassword) {
        return bcrypt.compare(candidatePassword, this.password);
    }

    toJSON() {
        const values = { ...this.get() };
        delete values.password;
        return values;
    }
}

User.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 255]
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notEmpty: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [6, 255]
            }
        },
        role: {
            type: DataTypes.ENUM('patient', 'doctor', 'admin'),
            allowNull: false,
            defaultValue: 'patient'
        },
        specialization: {
            type: DataTypes.STRING,
            allowNull: true
        },
        availableTime: {
            type: DataTypes.JSON,
            allowNull: true
        },
        availabilitySlots: {
            type: DataTypes.JSON,
            allowNull: true
        },
        qualification: {
            type: DataTypes.STRING,
            allowNull: true
        },
        experience: {
            type: DataTypes.STRING,
            allowNull: true
        },
        consultationFee: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0
        },
        rating: {
            type: DataTypes.JSON,
            allowNull: true
        },
        profileImage: {
            type: DataTypes.STRING,
            allowNull: true
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                is: {
                    args: [/^(\+251|0)?9\d{8}$/],
                    msg: 'Please enter a valid phone number'
                }
            }
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        sequelize,
        modelName: 'User',
        defaultScope: {
            attributes: { exclude: ['password'] }
        },
        scopes: {
            withPassword: { attributes: { } }
        }
    }
);

User.addHook('beforeSave', async (user) => {
    if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
    }
});

module.exports = User;