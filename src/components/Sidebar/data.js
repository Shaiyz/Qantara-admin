import {
  faCar,
  faUser,
  faList,
  faUserShield,
  faMoneyBill,
  faListAlt,
  faMapMarker,
  faReorder,
  faCogs,
} from "@fortawesome/free-solid-svg-icons";

const dataList = {
  admin_data: [
    {
      title: "Users",
      url: "user",
      icon: faUser,
      list: [
        {
          title: "Customers",
          url: "customers",
          icon: faUser,
        },
      ],
    },

    {
      title: "Orders",
      url: "order",
      icon: faMoneyBill,
    },
    {
      title: "Products",
      url: "bookings",
      icon: faList,
      list: [
        {
          title: "All Product",
          url: "bookings",
          icon: faList,
        },
      ],
    },
    {
      title: "Categories",
      url: "categories",
      icon: faList,
      list: [
        {
          title: "All Categories",
          url: "categories",
          icon: faList,
        },
        {
          title: "All Sub categories",
          url: "sub-category",
          icon: faList,
        },
      ],
    },

    {
      title: "Settings",
      url: "dashboard",
      icon: faCogs,
      list: [
        {
          title: "Add Category",
          url: "types",
          icon: faList,
        },
        {
          title: "Add Product",
          url: "company",
          icon: faList,
        },
        {
          title: "Add Sub-Category",
          url: "carname",
          icon: faList,
        },
        {
          title: "Add Banner",
          url: "carname",
          icon: faList,
        },
      ],
    },
  ],
  superadmin_data: [
    {
      title: "Users",
      url: "user",
      icon: faUser,
      list: [
        {
          title: "Customers",
          url: "customers",
          icon: faUser,
        },
        {
          title: "Admins",
          url: "admins",
          icon: faUser,
        },
        {
          title: "Super Admins",
          url: "superadmins",
          icon: faUser,
        },
      ],
    },

    {
      title: "Orders",
      url: "order",
      icon: faMoneyBill,
    },
    {
      title: "Products",
      url: "products",
      icon: faList,
      list: [
        {
          title: "All Product",
          url: "products",
          icon: faList,
        },
      ],
    },
    {
      title: "Categories",
      url: "categories",
      icon: faList,
      list: [
        {
          title: "All Categories",
          url: "categories",
          icon: faList,
        },
        {
          title: "All Sub categories",
          url: "subcategories",
          icon: faList,
        },
      ],
    },

    {
      title: "Settings",
      url: "dashboard",
      icon: faCogs,
      list: [
        // {
        //   title: "Add Category",
        //   url: "types",
        //   icon: faList,
        // },
        // {
        //   title: "Add Product",
        //   url: "company",
        //   icon: faList,
        // },
        // {
        //   title: "Add Sub-Category",
        //   url: "carname",
        //   icon: faList,
        // },
        {
          title: "Add Banner",
          url: "carname",
          icon: faList,
        },
      ],
    },
  ],

  saveList: (list, userId) => {
    if (!localStorage.getItem(userId)) {
      localStorage.removeItem(userId);
      localStorage.setItem(userId, JSON.stringify(list));
    }
    localStorage.setItem(userId, JSON.stringify(list));
  },
  getList: function (userId, userRole) {
    if (userRole == "admin") {
      return this.admin_data;
    } else if (userRole === "superadmin") {
      return this.superadmin_data;
    }
  },
};
export default dataList;
