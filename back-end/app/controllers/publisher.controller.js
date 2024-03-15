const ApiError = require("../api-error.js");
const MongoDB = require("../utils/mongodb.util.js");
const PublishersService = require("../services/publisher.service.js");
const BookService = require("../services/book.service.js");
const multer = require('../../multerConfig.js');
const fs = require('fs').promises;
const { ObjectId } = require("mongodb");

exports.create = async (req, res, next) => {
    if (!req.body?.publisher_name) {
        return next(new ApiError(400, "Name can not be empty"));
    }

    try {
        const publishersService = new PublishersService(MongoDB.client);
        const document = await publishersService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "An Error Occurred while creating the nxb"));
    }
};

exports.findALL = async (req, res, next) => {
    let documents = [];

    try {
        const publishersService = new PublishersService(MongoDB.client);
        const { publisher_name } = req.query;
        if (publisher_name) {
            documents = await publishersService.findByName(publisher_name);
        } else {
            documents = await publishersService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while retrieving contacts")
        );
    }

    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const publishersService = new PublishersService(MongoDB.client);
        const document = await publishersService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while retrieving contacts")
        );
    };
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length == 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const publishersService = new PublishersService(MongoDB.client);
        const document = await publishersService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "nxb not found"));
        }
        return res.send({ messgae: "nxb was updated successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error updating nxb with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const publishersService = new PublishersService(MongoDB.client);
        const bookService = new BookService(MongoDB.client);
        const listBookIds = req.query.bookIds;
        listBookIds.forEach(async (bookId) => {
                const book = await bookService.delete(bookId);
                await fs.unlink(book.book_image);
        });
        const document = await publishersService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "nxb not found"));
        }
        return res.send({ messgae: "nxb was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete nxb with id=${req.params.id}`)
        );
    }
};

exports.deleteALL = async (req, res, next) => {
    try {
        const publishersService = new PublishersService(MongoDB.client);
        const deletedCount = await publishersService.deleteAll();
        return res.send({
            message: `${deletedCount} nxbs were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while removing all nxbs")
        );
    }
};
