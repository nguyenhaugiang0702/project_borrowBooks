const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const CheckoutService = require("../services/checkout.service");
const { ObjectId } = require("mongodb");


exports.create = async (req, res, next) => {
    const { selectedBooks, user_id } = req.body;
    if (!selectedBooks || !user_id) {
        return next(
            new ApiError(500, "Loi khi checkout")
        );
    }
    try {
        const checkoutService = new CheckoutService(MongoDB.client);
        let checkouted = await checkoutService.find({ user_id });
        if(checkouted){
            await checkoutService.deleteCheckOut(req.body.user_id);
        }
        document = await checkoutService.create({ selectedBooks, user_id });
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "Loi khi them checkout moi")
        );
    }
};

exports.findALL = async (req, res, next) => {
    let documents = [];

    try {
        const checkoutService = new CheckoutService(MongoDB.client);
        const { nxb_name } = req.query;
        if (nxb_name) {
            documents = await checkoutService.findByName(nxb_name);
        } else {
            documents = await checkoutService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while retrieving checkouts")
        );
    }

    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const checkoutService = new CheckoutService(MongoDB.client);
        const user_id = new ObjectId(req.params.id);
        const document = await checkoutService.find({ user_id });
        if (!document) {
            return next(new ApiError(404, "Checkout not found"));
        }
        return res.send(document[0]);
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while retrieving checkouts")
        );
    };
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length == 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const adminService = new CheckoutService(MongoDB.client);
        const document = await adminService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "checkout not found"));
        }
        return res.send({ messgae: "checkout was updated successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error updating checkout with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const adminService = new CheckoutService(MongoDB.client);
        const document = await adminService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "checkout not found"));
        }
        return res.send({ messgae: "checkout was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete checkout with id=${req.params.id}`)
        );
    }
};

exports.deleteALL = async (req, res, next) => {
    try {
        const adminService = new CheckoutService(MongoDB.client);
        const deletedCount = await adminService.deleteAll();
        return res.send({
            message: `${deletedCount} checkouts were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while removing all checkouts")
        );
    }
};
