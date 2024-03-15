const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const CartService = require("../services/cart.service");
const BookService = require("../services/book.service");
const BorrowService = require("../services/borrow.service");
const PublisherService = require("../services/publisher.service");
const { ObjectId } = require("mongodb");
const CheckoutService = require("../services/checkout.service");
const UserService = require("../services/user.service");

exports.addtoTrackBookBorrowing = async (req, res, next) => {
    try {
        const { checkoutInfoOfUser, user_id } = req.body;
        if (!req.body?.checkoutInfoOfUser || !req.body?.user_id) {
            return res.status(400).json({ message: "Vui lòng cung cấp checkoutInfoOfUser và user_id" });
        }
        const borrowService = new BorrowService(MongoDB.client);
        const cartService = new CartService(MongoDB.client);
        const bookService = new BookService(MongoDB.client);
        const checkoutService = new CheckoutService(MongoDB.client);
        const borrowedBooks = checkoutInfoOfUser.map(book => ({
            book_id: new ObjectId(book.book_id),
            quantity: book.quantity,
            total_price: book.total_price
        }));

        const total_Price = checkoutInfoOfUser.reduce((total, book) => total + book.total_price, 0);
        req.body.totalPrice = total_Price;
        const totalPrice = req.body.totalPrice;

        // tìm sách tồn tại trong giỏ hàng
        const existingBooksInCart = await cartService.findByUserId(user_id);

        const document = await borrowService.create({ checkoutInfoOfUser, totalPrice, user_id });
        for (const book of existingBooksInCart.books) {
            for (const borrowedBook of borrowedBooks) {
                if (borrowedBook.book_id.equals(book.book_id)) {
                    if (borrowedBook.quantity >= book.quantity) {
                        // nếu số lượng giỏ hàng lớn hơn thì xóa khỏi cart
                        await cartService.removeFromCart(user_id, book.book_id);
                    } else {
                        // nếu số lượng nhỏ hơn thì giảm số lượng
                        await cartService.reduceQuantity(user_id, book.book_id, borrowedBook.quantity);
                    }
                }
            }
        }

        await checkoutService.deleteCheckOut(user_id);

        return res.send(document);
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, "Không thể thêm vào giỏ hàng"));
    }
};

exports.findALL = async (req, res, next) => {
    let documentsWithDetails = [];

    try {
        const borrowService = new BorrowService(MongoDB.client);
        const userService = new UserService(MongoDB.client);
        const bookService = new BookService(MongoDB.client);
        const { borrow_name } = req.query;
        let documents = [];
        if (borrow_name) {
            documents = await borrowService.findByName(borrow_name);
        } else {
            documents = await borrowService.find({});
        }
        for (const doc of documents) {
            const user = await userService.findById(doc.user_id);
            const books = await Promise.all(doc.books.map(async (book) => {
                const bookDetail = await bookService.findById(book.book_id);
                return { ...bookDetail, quantity: book.quantity, return_number: book.return_number }
            }));

            let totalQuantity = 0;
            let totalReturnNumber=0;
            for (d of doc.books) {
                totalQuantity += d.quantity;
                totalReturnNumber+=parseInt(d.return_number);
            }

            const docWithDetails = {
                _id: doc._id,
                user: user,
                books: books,
                totalReturnNumber: totalReturnNumber,
                totalQuantity: totalQuantity,
                totalPrice: doc.totalPrice,
                status: doc.status,
                borrow_date: doc.borrow_date,
                return_date: doc.return_date ? doc.return_date : 'Chưa Biết',
            };

            documentsWithDetails.push(docWithDetails);
        }
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while retrieving contacts")
        );
    }

    return res.send(documentsWithDetails);
};

exports.getBorrowWithID = async (req, res, next) => {
    try {
        const borrowService = new BorrowService(MongoDB.client);
        const userService = new UserService(MongoDB.client);
        const bookService = new BookService(MongoDB.client);
        const document = await borrowService.findById(req.params.id);
        const userInfo = await userService.findById(document.user_id);
        const books = await Promise.all(document.books.map(async (book) => {
            const bookDetail = await bookService.findById(book.book_id);
            return { ...bookDetail, quantity: book.quantity, return_number: book.return_number }
        }));

        const docWithDetails = {
            _id: document._id ? document._id : null,
            user: userInfo ? userInfo : null,
            books: books ? books : null,
            totalQuantity: document.totalQuantity ? document.totalQuantity : null,
            totalPrice: document.totalPrice ? document.totalPrice : null,
            status: document.status ? document.status : null,
            borrow_date: document.borrow_date ? document.borrow_date : null,
            return_date: document.return_date ? document.return_date : 'Chưa Biết',
        };

        return res.send(docWithDetails);
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while retrieving contacts")
        );
    }
}

exports.getBorrowWithUserId = async (req, res, next) => {
    try {
        const borrowService = new BorrowService(MongoDB.client);
        const document = await borrowService.findBorrowWithUserId(req.params.user_id);
        
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while retrieving contacts")
        );
    }
}

exports.getCart = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const bookService = new BookService(MongoDB.client);
        const user_id = new ObjectId(req.params.id);
        const cart = await cartService.find({ user_id });
        if (!cart) {
            return next(new ApiError(404, `Không tìm thấy cart của người dùng ${user_id}`));
        }
        const booksWithImgAndName = await Promise.all(
            cart[0].books.map(async (item) => {
                const book = await bookService.findById(item.book_id);
                const total_price = item.quantity * book.book_price;
                return {
                    book_id: item.book_id,
                    quantity: item.quantity,
                    book_name: book ? book.book_name : null,
                    book_image: book ? book.book_image : null,
                    book_price: book ? book.book_price : null,
                    total_price: book ? total_price : null,
                }
            })
        );

        // Lọc ra các cuốn sách không null (nếu có)
        const validBooks = booksWithImgAndName.filter(book => book !== null);

        // Tính tổng giá trị của toàn bộ giỏ hàng
        const totalCartPrice = validBooks.reduce((total, book) => total + book.total_price, 0);

        const cartWithBooks = {
            user_id: cart[0].user_id,
            books: booksWithImgAndName,
            totalCartPrice: totalCartPrice,
        };
        return res.send(cartWithBooks);
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
        const cartService = new CartService(MongoDB.client);
        const document = await cartService.update(req.params.id, req.body);
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

exports.updateStatus = async (req, res, next) => {
    try {
        const borrowService = new BorrowService(MongoDB.client);
        const bookService = new BookService(MongoDB.client);
        const doc = await borrowService.updateStatus(req.params.id);

        // Cập nhật số lượng mượn vào cơ sở dữ liệu
        await Promise.all(doc.books.map(async (book) => {
            await bookService.updateBorrowedNumber(book.book_id, book.quantity);
        }));

        return res.send(doc);
    } catch (error) {
        return next(
            new ApiError(500, `Error updating nxb with id=${req.params.id}`)
        );
    }
};

exports.deleteBook = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const user_id = req.params.user_id;
        const book_id = req.params.book_id;
        console.log(user_id, book_id);
        const deletedProduct = await cartService.deleteProductFromCart(user_id, book_id);
        if (!deletedProduct) {
            return next(new ApiError(404, "book with user_id in cart not found"));
        }
        return res.send({ messgae: "book was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete book with id=${req.params.id}`)
        );
    }
};

exports.deleteAllBook = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const userId = req.params.user_id;
        console.log(userId);
        const deletedCount = await cartService.deleteAllProducts(userId);
        return res.send({
            message: `${deletedCount} nxbs were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while removing all nxbs")
        );
    }
};

exports.deleteBorrowWithId = async (req, res, next) => {
    try {
        const borrowService = new BorrowService(MongoDB.client);
        const borrowId = req.params.id;
        const deletedCount = await borrowService.delete(borrowId);
        return res.send({
            message: `${deletedCount} nxbs were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An Error Occurred while removing all nxbs")
        );
    }
};

exports.updateReturnBookNumber = async (req, res, next) => {
    try {
        const borrowId = req.params.id;
        const { books } = req.body;
        if (!books || !Array.isArray(books) || books.length === 0 || !borrowId) {
            return res.status(400).json({ message: "Vui lòng cung cấp thông tin sách cần cập nhật" });
        }
        const borrowService = new BorrowService(MongoDB.client);
        await Promise.all(books.map(async (book) => {
            const { book_id, return_number } = book;
            await borrowService.updateReturnNumber(book_id, borrowId, return_number);
        }));

        return res.status(200).json({ message: "Cập nhật số lượng trả thành công" });
    } catch (error) {
        return next(
            new ApiError(500, "Error while checking books for publisher")
        );
    }
}