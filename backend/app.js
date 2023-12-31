const express = require ('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { ValidationError } = require('sequelize');

const { environment } = require('./config');
const isProduction = environment === 'production';

const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

if (!isProduction) {
    app.use(cors());
}

app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
);

app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
);

const routes = require('./routes');

app.use(routes);

app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = { message: "The requested resource couldn't be found." };
    err.status = 404;
    next(err);
});

app.use((err, _req, _res, next) => {
    if (err instanceof ValidationError) {
        let errors = {};
        for (let error of err.errors) {
            //sign up errors
            if (error.message === "email must be unique") {
                error.message = "User with that email already exists";
                err.message = "User already exists."
            } else err.title = 'Validation error';

            if (error.message === 'username must be unique') {
                error.message = "User with that username already exists";
                err.message = "User already exists";
            }

            if (error.message === 'Validation isAlpha on firstName failed') {
                error.message = "First name can only be letters";
                err.message = "Bad Request";
                err.status = 400
            }

            if (error.message === 'Validation isAlpha on lastName failed') {
                error.message = "Last name can only be letters";
                err.message = "Bad Request"
                err.status = 400;
            }

            if (error.message === 'Validation len on username failed') {
                error.message = "Username must be between 4 and 30 characters";
                err.message = "Bad Request"
                err.status = 400;
            }
            //create a spot errors
            if (error.message === 'Spot.address cannot be null') {
                error.message = 'Street address is required',
                err.message = 'Bad Request'
                err.status = 400
            }

            if (error.message === 'Spot.city cannot be null') {
                error.message = 'City is required',
                err.message = 'Bad Request'
                err.status = 400
            }

            if (error.message === 'Spot.state cannot be null') {
                error.message = 'State is required';
                err.message = 'Bad Request'
                err.status = 400
            }

            if (error.message === 'Spot.country cannot be null') {
                error.message = 'Country is required';
                err.message = 'Bad Request'
                err.status = 400
            }

            if (error.message === 'Spot.lat cannot be null') {
                error.message = 'Lattitude is not valid',
                err.message = 'Bad Request'
                err.status = 400
            }

            if (error.message === 'Spot.lng cannot be null') {
                error.message = 'Longitude is not valid';
                err.message = 'Bad Request'
                err.status = 400
            }

            if (error.message === 'Spot.name cannot be null') {
                error.message = 'Name is required';
                err.message = 'Bad Request'
                err.status = 400
            }

            if (error.message === 'Spot.description cannot be null') {
                error.message = 'Description is required';
                err.message  = 'Bad Request'
                err.status = 400
            }

            if (error.message === 'Spot.price cannot be null') {
                error.message = 'Price per day is required';
                err.message = 'Bad Request'
                err.status = 400
            }

            if (error.message === 'Validation len on name failed') {
                error.message = 'Name must be less than 50 characters';
                err.message = 'Bad Request'
                err.status = 400
            }

            if (error.message === 'name must be unique') {
                error.message = 'Name is already taken'
                err.message = 'Bad Request'
                err.status = 400
            }

            if (error.message === 'Validation min on lng failed' || error.message === 'Validation max on lng failed') {
                error.message = 'Longitude is not valid';
                err.message = 'Bad Request';
                err.status = 400
            }

            if (error.message === 'Validation min on lat failed' || error.message === 'Validation min on lat failed') {
                error.message = 'Latitude is not valid';
                err.message = 'Bad Request';
                err.status = 400
            }

            if (error.message === 'Validation notEmpty on address failed') {
                error.message = 'Address cannot be empty';
                err.message = 'Bad Request';
                err.status = 400
            }

            if (error.message === 'Validation not Empty on city failed') {
                error.message = 'City cannot be empty';
                err.message = 'Bad Request';
                err.status = 400;
            }

            if (error.message === 'Validation notEmpty on state failed') {
                error.message = 'State cannot be empty';
                err.message = 'Bad Request';
                err.status = 400;
            }

            if (error.message === 'Validation notEmpty on country failed') {
                error.message = 'Country cannot be empty'
                err.message = 'Bad Request'
                err.status = 400
            }

            if (error.message === 'Validation len on description failed') {
                error.message = 'Description must be between 15 and 256 characters';
                err.message = 'Bad Request';
                err.status = 400
            }

            if (error.message === 'Validation max on price failed' || error.message === 'Validation min on price failed') {
                error.message = 'Price must be between 1 and 30,000'
                err.message = 'Bad Request';
                err.status = 400
            }

            //spotimage errors
            if (error.message === 'url must be unique') {
                error.message = 'Url belongs to another Image';
                err.message = 'Bad Request';
                err.status = 400
            }

            if (error.message === 'SpotImage.preview cannot be null') {
                error.message = 'Preview required';
                err.message = 'Bad Reqeust';
                err.status = 400
            }

            if (error.message === 'SpotImage.url cannot be null' || error.message === 'Validation notEmpty on url failed') {
                error.message = 'Image Url required';
                err.message = 'Bad Request';
                err.status = 400;
            }

            if (error.message.includes('is not a valid boolean')) {
                error.message = 'Preview must be true or false';
                err.message = 'Bad Request';
                err.status = 400
            }            

            //review errors

            if (error.message === 'Review.stars cannot be null') {
                error.message = "Stars are required";
                err.message = 'Bad Request';
                err.status = 400
            }

            if (error.message === 'Review.review cannot be null') {
                error.message = 'Review text is required';
                err.message = 'Bad Request';
                err.status = 400;
            }

            if (error.message === 'Validation max on stars failed' || error.message === 'Validation min on stars failed') {
                error.message = 'Stars must be an integer from 1 to 5';
                err.message = 'Bad Request';
                err.status = 400
            }

            if (error.message === 'Validation len on review failed') {
                error.message = 'Review text must be between 10 and 256 characters';
                err.message = 'Bad Request';
                err.status = 400
            }

            //ReviewImage errors

            if (error.message === 'ReviewImage.url cannot be null') {
                error.message = 'Review Image url is required';
                err.message = 'Bad Request';
                err.status = 400
            }

            //booking errors
            if (error.message === 'endDate must be after startDate') {
                error.message = 'endDate cannot be on or before startDate';
                err.message = 'Bad Request';
                err.status = 400
            }

            if (error.message === 'null is not a valid date') {
                error.message = 'Please provide a valid date';
                err.message = 'Bad Request';
                err.status = 400
            }

            //route validation errors
            if (error.message.includes('is not a valid integer')) {
                error.message = 'Please provide a valid integer';
                err.message = 'Bad request';
                err.status = 404;
            }

            
            errors[error.path] = error.message
        }
        // err.title = 'Validation error';
        err.errors = errors;
    }

    
    next(err);
})

app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);

    //log-in errors
    if (err.title === 'Login failed') {
        if (!isProduction) {
            res.json({
                title: err.title,
                message: err.message,
                errors: err.errors,
                stack: err.stack
            })
        } else {
            res.json({
                message: err.message
            })
        }
    }

    //sign-up errors
    if (!isProduction) {
        res.json({
            title: err.title || 'Server Error',
            message: err.message,
            errors: err.errors,
            stack: isProduction ? null : err.stack
        })
    } else {
        res.json(
            {
                message: err.message,
                errors: err.errors
            }
        )
    }
    
})



module.exports = app