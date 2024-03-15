const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const AdminService = require("../services/admin.service");
const jwt = require('jsonwebtoken');


exports.login = async (req, res, next) => {
    if (!req.body?.admin_name || !req.body?.admin_pass) {
        return next(new ApiError(400, "Tên người dùng và mật khẩu không được để trống"));
    }

    try {
        const adminService = new AdminService(MongoDB.client);
        const admin = await adminService.authenticate(req.body);
        // const token = jwt.sign({ _id: admin._id }, 'myToken', { expiresIn: '1h' });

        return res.json({
            message: 'Thanh cong',
        });
    } catch (error) {
        const errorMessage = error.message || "Có lỗi xảy ra";
        return next(new ApiError(401, errorMessage));   
    }
};

exports.findALL = async (req, res, next) => {
    let documents = [];

    try {
        const adminService = new AdminService(MongoDB.client);
        const { nxb_name } = req.query;
        if (nxb_name) {
            documents = await adminService.findByName(nxb_name);
        } else {
            documents = await adminService.find({});
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
        const adminService = new AdminService(MongoDB.client);
        const document = await adminService.findById(req.params.id);
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
        const adminService = new AdminService(MongoDB.client);
        const document = await adminService.update(req.params.id, req.body);
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
        const adminService = new AdminService(MongoDB.client);
        const document = await adminService.delete(req.params.id);
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
        const adminService = new AdminService(MongoDB.client);
        const deletedCount = await adminService.deleteAll();
        return res.send({
            message: `${deletedCount} nxbs were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while removing all nxbs")
        );
    }
};

