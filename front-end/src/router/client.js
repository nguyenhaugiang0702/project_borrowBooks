const client = [
    {
        path: "/",
        redirect: "/home",
        component: () => import("../layouts/client.vue"),
        children: [
            {
                path: "home",
                name: 'home',
                component: () => import("../pages/client/Home.vue"),
            },
            {
                path: "books",
                name: 'booksPage',
                component: () => import("../pages/client/Book.vue"),
            },
            {
                path: "/books/:publisherId",
                name: 'books-filter-nxb',
                component: () => import("../pages/client/FilterNxb.vue"),
                props: true ,
            },
            {
                path: "/books/detail/:id",
                name: 'books-detail',
                component: () => import("../pages/client/Detail.vue"),
            },
            {
                path: "cart",
                name: 'cart',
                component: () => import("../pages/client/Cart.vue"),
            },
            {
                path: "checkout",
                name: 'checkout',
                component: () => import("../pages/client/CheckOut.vue"),
            },
        ],
    },

];

export default client;
