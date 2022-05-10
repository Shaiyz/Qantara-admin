const router = require("express").Router();
const {
  User,
  Customer,
  Favorite,
  Cart,
  Merchant,
  Member,
} = require("../models");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { login } = require("../middlewares");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const {
  sendEmail,
  sendEmailTitan,
  sendLink,
  getRandomChars,
} = require("../util");

/**
 * @route           POST /user/login
 * @description     Login with email and password
 */
router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (error, user, info) => {
    if (error || !user) {
      res.status(500).json({ message: info.message });
    } else if (!user.isActive) {
      res.status(500).json({ message: "Inactive user can't login" });
    } else {
      const token = jwt.sign(user.toObject(), process.env.JWT_SECRET_KEY);
      let response = { data: { user }, token, message: "Login success" };
      if (user.role === "customer") {
        Customer.findOne({ user: user._id })
          .populate("user addresses.country")
          .exec()
          .then((doc) => {
            if (!doc)
              return Promise.reject(new Error("Customer doesn't exist'"));
            response.data = {
              ...doc.toObject(),
              addresses: doc.addresses.map((ua) => ({
                ...ua.toObject(),
                country: {
                  ...ua.toObject().country,
                  cities: undefined,
                },
                city: ua.country.cities.find(
                  (uac) => uac._id + "" == ua.city + ""
                ),
              })),
            };
            return Promise.all([
              Favorite.findOne({ customer: doc._id })
                .populate([
                  {
                    path: "items",
                    populate: [{ path: "member_user product" }],
                  },
                ])
                .exec(),
              Cart.findOne({ customer: doc._id })
                .populate([
                  {
                    path: "items",
                    populate: [{ path: "member_user product" }],
                  },
                ])
                .exec(),
            ]);
          })
          .then(([favorite, cart]) => {
            response = { ...response, favorite, cart };
            res.status(200).json(response);
          })
          .catch((error) => {
            res.status(500).json({ message: error.message });
          });
      } else if (user.role === "member") {
        Member.findOne({ user: user._id })
          .populate("user")
          .exec()
          .then((doc) => {
            if (!doc) return Promise.reject(new Error("Member doesn't exist'"));
            res.status(200).json({ ...response, data: doc });
          })
          .catch((error) => {
            res.status(500).json({ message: error.message });
          });
      } else if (user.role === "merchant") {
        Merchant.findOne({ user: user._id })
          .populate("user")
          .exec()
          .then((doc) => {
            if (!doc)
              return Promise.reject(new Error("Merchant doesn't exist'"));
            res.status(200).json({ ...response, data: doc });
          })
          .catch((error) => {
            res.status(500).json({ message: error.message });
          });
      } else {
        res.status(200).json(response);
      }
    }
  })(req, res, next);
});

/**
 * @route           POST /user/signin
 * @description     Login with phone and password
 */
router.post("/signin", (req, res, next) => {
  passport.authenticate("local1", { session: false }, (error, user, info) => {
    if (error || !user) {
      res.status(500).json({ message: info.message });
    } else {
      const token = jwt.sign(user.toObject(), process.env.JWT_SECRET_KEY);
      res.status(200).json({ data: user, token });
    }
  })(req, res, next);
});

/**
 * @route           POST /user/eksplodecode/signin
 * @description     Login with eksplode_code and password
 */
router.post("/eksplodecode/signin", (req, res, next) => {
  passport.authenticate("local2", { session: false }, (error, user, info) => {
    if (error || !user) {
      res.status(500).json({ message: info.message });
    } else {
      const token = jwt.sign(user.toObject(), process.env.JWT_SECRET_KEY);
      res.status(200).json({ data: user, token });
    }
  })(req, res, next);
});
/**
 * @route   POST /user/create/admin
 * @desc    Create an admin user
 * @body    { user_name, email,phone, password }
 */

router.post("/create/admin", (req, res, next) => {
  new User({ ...req.body, role: "admin" })
    .save()
    .then((doc) => {
      res.status(200).json({
        data: doc,
        message: "Admin Created Successfully",
      });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

/**
 * @route   POST /user/create/member
 * @desc    Create an member user
 * @body    { user_name, email,phone, password }
 */

router.post("/create/member", (req, res, next) => {
  let token;
  new User({ ...req.body, role: "member" })
    .save()
    .then((doc) => {
      token = jwt.sign(doc.toObject(), process.env.JWT_SECRET_KEY);
      return new Member({
        user: doc._id,
        paypal_account: req.body.paypal_account,
      }).save();
    })
    .then((doc) => doc.populate("user").execPopulate())
    .then((doc) => {
      res.status(200).json({
        data: doc,
        token,
        message: "Member Created Successfully",
      });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});
/**
 * @route   POST /user/create/star
 * @desc    Create an star user
 * @body    { user_name, email,phone, password }
 */

router.post("/create/star", (req, res, next) => {
  new User({ ...req.body, role: "star" })
    .save()
    .then((doc) => {
      res.status(200).json({
        data: doc,
        message: "Star Created Successfully",
      });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});
/**
 * @route         POST /user/create
 * @description   Insert a user record
 */
router.post("/create", (req, res, next) => {
  new User(req.body)
    .save()
    .then((doc) => doc.execPopulate())
    .then((doc) => {
      if (!doc) return Promise.reject(new Error("Couldn't Create User"));
      res.status(200).json({ data: doc });
    })
    .catch((error) => res.status(500).json({ message: error.message }));
});
/**
 * @route           GET /user
 * @description     Get user limits records
 * @query           ?email={}&role={}&_id={}&name={}&fields={}
 */
router.get("/", (req, res, next) => {
  let query = {};
  let fields = "";
  if ("role" in req.query) query.role = req.query.role;
  if ("isActive" in req.query) query.isActive = req.query.isActive;
  if ("email" in req.query) query.email = req.query.email;
  if ("phone" in req.query) query.phone = req.query.phone;
  if ("_id" in req.query) query._id = { $in: req.query._id.split(",") };
  if ("name" in req.query)
    query.user_name = { $regex: req.query.name, $options: "i" };
  if ("fields" in req.query) fields = req.query.fields.replace(",", " ");

  User.find(query)
    .select(fields)
    .exec()
    .then((doc) => {
      res.status(200).json({ data: doc });
    })
    .catch((error) => res.status(500).json({ message: error.message }));
});

router.get("/my", login("Validating with Token"), (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (!user) return Promise.reject(new Error("Token Error"));
      const token = jwt.sign(user.toObject(), process.env.JWT_SECRET_KEY);
      let response = { data: { user }, token, message: "Login success" };
      if (user.role === "customer") {
        return Customer.findOne({ user: user._id })
          .populate("user addresses.country")
          .exec()
          .then((doc) => {
            if (!doc)
              return Promise.reject(new Error("Customer doesn't exist'"));
            response.data = {
              ...doc.toObject(),
              addresses: doc.addresses.map((ua) => ({
                ...ua.toObject(),
                country: {
                  ...ua.toObject().country,
                  cities: undefined,
                },
                city: ua.country.cities.find(
                  (uac) => uac._id + "" == ua.city + ""
                ),
              })),
            };
            return Promise.all([
              Favorite.findOne({ customer: doc._id })
                .populate([
                  {
                    path: "items",
                    populate: [{ path: "member_user product" }],
                  },
                ])
                .exec(),
              Cart.findOne({ customer: doc._id })
                .populate([
                  {
                    path: "items",
                    populate: [{ path: "member_user product" }],
                  },
                ])
                .exec(),
            ]);
          })
          .then(([favorite, cart]) =>
            Promise.resolve({ ...response, favorite, cart })
          )
          .catch((error) => Promise.reject(error));
      } else if (user.role === "member") {
        return Member.findOne({ user: user._id })
          .populate("user")
          .exec()
          .then((doc) => {
            if (!doc) return Promise.reject(new Error("Member doesn't exist'"));
            return Promise.resolve({ ...response, data: doc });
          })
          .catch((error) => Promise.reject(error));
      } else if (user.role === "merchant") {
        return Merchant.findOne({ user: user._id })
          .populate("user")
          .exec()
          .then((doc) => {
            if (!doc)
              return Promise.reject(new Error("Merchant doesn't exist'"));
            return Promise.resolve({ ...response, data: doc });
          })
          .catch((error) => Promise.reject(error));
      } else {
        return Promise.resolve(response);
      }
    })
    .then((doc) => {
      res.status(200).json({ ...doc });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});
/**
 * @route   POST /user/create/admin
 * @desc    Create a Customer
 * @body    { name, email, password, phone, address: { name, zip, city, state, country } }
 */
router.post("/create/customer", (req, res, next) => {
  const ud = {
    user_name: req.body.user_name,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    role: "customer",
  };
  const cd = {
    phone: req.body.phone,
    addresses: [req.body.address],
  };
  new User(ud)
    .save()
    .then((doc) => {
      return new Customer({ ...cd, user: doc._id }).save();
    })
    .then((doc) => doc.populate("user").execPopulate())
    .then((doc) => {
      return Promise.all([
        new Favorite({ customer: doc._id }).save(),
        new Cart({ customer: doc._id }).save(),
        doc,
      ]);
    })
    .then(([favorite, cart, customer]) => {
      res.status(200).json({
        data: customer,
        favorite: favorite,
        cart: cart,
        message: "Customer, Cart and Favorite List Created Successfully",
      });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});
/**
 * @route   POST /user/create/owner
 * @desc    Create a Owner
 * @body    { name, email, password, company_address,website,business_type,paypal_account }
 */
router.post("/create/owner", (req, res, next) => {
  const ud = {
    user_name: req.body.user_name,
    email: req.body.email,
    password: req.body.password,
    role: "owner",
  };
  const cd = {
    company_address: req.body.company_address,
    website: req.body.website,
    business_type: req.body.business_type,
    paypal_account: req.body.paypal_account,
  };
  new User(ud)
    .save()
    .then((doc) => {
      return new Owner({ ...cd, user: doc._id }).save();
    })
    .then((doc) => doc.populate("user").execPopulate())
    .then((owner) => {
      res.status(200).json({
        data: owner,
        message: "Owner List Created Successfully",
      });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

/**
 * @route   POST /user/create/gamer
 * @desc    Create a Gamer
 * @body    { name, email, password, }
 */
router.post("/create/gamer", (req, res, next) => {
  const ud = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    role: "gamer",
  };

  new User(ud)
    .save()
    .then((doc) => {
      res.status(200).json({
        data: doc,
        message: "Gamer Created Successfully",
      });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

/**
 * @route   POST /user/create/merchant
 * @desc    Create a Owner
 * @body    { name, email, password, company_address,website,business_type,paypal_account }
 */
router.post("/create/merchant", (req, res, next) => {
  const ud = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    city: req.body.city,
    category: req.body.category,
    role: "merchant",
  };
  const cd = {
    company_address: req.body.company_address,
    website: req.body.website,
    paypal_account: req.body.paypal_account,
    bank_routing: req.body.bank_routing,
    participating_merchant: true,
  };
  new User(ud)
    .save()
    .then((doc) => {
      return new Merchant({ ...cd, user: doc._id }).save();
    })
    .then((doc) => doc.populate("user").execPopulate())
    .then((owner) => {
      res.status(200).json({
        data: owner,
        message: "Merchant Created Successfully",
      });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

/**
 * @route   POST /user/create/merchant/eksplode_code
 * @desc    Create a Owner
 * @body    { name, email, password, company_address,website,business_type,paypal_account }
 */

router.post("/create/merchant/eksplode_code", (req, res, next) => {
  const ud = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    city: req.body.city,
    category: req.body.category,
    role: "merchant",
  };
  const cd = {
    company_address: req.body.company_address,
    website: req.body.website,
    paypal_account: req.body.paypal_account,
    bank_routing: req.body.bank_routing,
  };
  new User(ud)
    .save()
    .then((doc) => {
      return new Merchant({ ...cd, user: doc._id }).save();
    })
    .then((doc) => doc.populate("user").execPopulate())
    .then((owner) => {
      res.status(200).json({
        data: owner,
        message: "Merchant Created Successfully",
      });
    })
    .catch((error) => {
      res.status(500).json(
        error.keyValue.email
          ? {
              message: "This email already exists! Please try another Email.",
            }
          : { message: error.message }
      );
    });
});
/**
 * @route   PUT /user/:user_id
 * @desc    Edit a user
 * Only for development, Use PUT /customer/:customer_id and PUT /admin/:admin_id instead.
 */

router.put("/:user_id", (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.params.user_id },
    { ...req.body },
    { new: true, useFindAndModify: false }
  )
    .then((doc) => {
      res.status(200).json({ data: doc, message: "Updated" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

/**
 * @route   PUT /user/password/change
 * @desc    Change Password
 * @body    { _id, curr_pass, new_pass }
 */

router.put("/:id/password/change", (req, res, next) => {
  if (!("curr_pass" in req.body && "new_pass" in req.body))
    return res.status(400).json({ message: "Invalid Request Format" });
  User.findById(req.params.id)
    .then((doc) => {
      if (!doc) {
        return Promise.reject(new Error("No Such User Found"));
      } else if (!User.checkPassword(req.body.curr_pass, doc.password)) {
        return Promise.reject(new Error("Current Password is incorrect"));
      } else {
        return User.findByIdAndUpdate(
          req.params.id,
          { password: bcrypt.hashSync(req.body.new_pass, 10) },
          { new: true }
        ).exec();
      }
    })
    .then((doc) => {
      const token = jwt.sign(doc.toObject(), process.env.JWT_SECRET_KEY);
      res.status(200).json({ message: "Password Changed", data: doc, token });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

/**
 * @route       DELETE /user/:id
 * @description Delete a user record by id
 */
router.delete("/:id" /*, login("USER DELETE ROUTE")*/, (req, res, next) => {
  User.findByIdAndDelete(req.params.id)
    .then((doc) => {
      res.status(200).json({ data: doc, status: "Object Deleted" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});
/**
 * @route       PUT /superadmin/:id/password/forgot
 * @description Send Email of a new password
 */
router.put("/password/forgot", (req, res, next) => {
  const password = getRandomChars(8);
  User.findOneAndUpdate(
    { email: req.body.email },
    { password: bcrypt.hashSync(password, 10) },
    { new: true }
  )
    .then((doc) => {
      if (!doc)
        return Promise.reject(
          new Error(`Admin with Email '${req.body.email}' Not Found`)
        );
      return sendEmail(doc.email, {
        email: doc.email,
        password,
        message:
          "Here is your new password. Make sure to change after logging in with this password",
      });
    })
    .then(() => {
      res.status(200).json({ data: { status: "Email Sent" } });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

/**
 * @route   POST /user/ipaddress
 * @desc    Verify User Ip Address
 * @body    { ip? }
 */
router.post("/ipaddress", (req, res, next) => {
  User.findOne({ ip_address: req.body.ip }, { new: true })
    .then((doc) => {
      if (!doc) {
        res.status(401).json({ code: 401, message: "Ip Address Not exist..!" });
      } else {
        res
          .status(201)
          .json({ code: 201, message: "Ip Address Sucessfully matched..!!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

/**
 * @route       PUT /user/password/forgot
 * @description Send Email of a new password
 */

router.put("/password/forget", (req, res, next) => {
  const password = getRandomChars(8);
  User.findOneAndUpdate(
    { email: req.body.email },
    { password: bcrypt.hashSync(password, 10) },
    { new: true }
  )
    .then((doc) => {
      if (!doc)
        return Promise.reject(
          new Error(`User with Email '${req.body.email}' Not Found`)
        );
      if (doc.role === "gamer") {
        return sendEmailTitan(doc.email, "forgetPasswordTitan", {
          email: doc.email,
          password,
          message:
            "Here is your new password. Make sure to change after logging in with this password",
          subject: "Forget Password",
        });
      } else {
        return sendEmail(doc.email, {
          email: doc.email,
          password,
          message:
            "Here is your new password. Make sure to change after logging in with this password",
        });
      }
    })
    .then(() => {
      res.status(200).json({ data: { status: "Email Sent" } });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

/**
 * @route       PUT /user/member/password/forget
 * @description Send Email of a new password
 */

router.put("/member/password/forget", (req, res, next) => {
  const password = getRandomChars(8);

  User.findOne(
    { email: req.body.email }
    // { password: bcrypt.hashSync(password, 10) },
    // { new: true }
  )
    .then((doc) => {
      if (!doc) {
        return Promise.reject(
          new Error(`User with Email '${req.body.email}' Not Found`)
        );
      } else if (
        doc.member_bestfriend !== req.body.member_bestfriend &&
        doc.member_favorite_color !== req.body.member_favorite_color
      ) {
        return Promise.reject(new Error(`wrong answer to questions`));
      } else {
        User.findByIdAndUpdate(
          { _id: doc._id },
          { password: bcrypt.hashSync(password, 10) },
          { new: true }
        ).exec();

        return sendEmail(doc.email, {
          email: doc.email,
          password,
          message:
            "Here is your new password. Make sure to change after logging in with this password",
        });
      }
    })
    .then(() => {
      res.status(200).json({
        data: {
          status: "Email Sent",
          message: "Your new password has been sent on your email",
        },
      });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

/**
 * @route       PUT /user/star/password/forget
 * @description Send Email of a new password
 */

router.put("/star/password/forget", (req, res, next) => {
  const password = getRandomChars(8);
  User.findOne(
    {
      email: req.body.email,
    }
    // { password: bcrypt.hashSync(password, 10) },
    // { new: true }
  )
    .then((doc) => {
      if (!doc) {
        return Promise.reject(
          new Error(`User with Email '${req.body.email}' Not Found`)
        );
      } else if (
        doc.star_bestfriend !== req.body.star_bestfriend ||
        doc.star_favorite_color !== req.body.star_favorite_color
      ) {
        return Promise.reject(new Error(`wrong answer to questions`));
      } else {
        User.findByIdAndUpdate(
          { _id: doc._id },
          { password: bcrypt.hashSync(password, 10) },
          { new: true }
        ).exec();

        return sendEmail(doc.email, {
          email: doc.email,
          password,
          message:
            "Here is your new password. Make sure to change after logging in with this password",
        });
      }
    })
    .then(() => {
      res.status(200).json({
        data: {
          status: "Email Sent",
          message: "Your new password has been sent on your email",
        },
      });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

/* @route		PUT /user/ipaddress/:user_id
 * @desc		Edit IP records
 * @body		{ _id?, ip_address?}
 */

router.put("/ipaddress/:user_id", (req, res, next) => {
  const cd = {
    ip_address: req.body.ip_address,
  };
  User.findOneAndUpdate({ _id: req.params.user_id }, { ...cd }, { new: true })
    .then((doc) => {
      res.status(200).json({ data: doc, message: "User IP Record Changed" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.get("/role", (req, res, next) => {
  let test = JSON.parse(req.query.val);
  // query.email =  { $regex: req.query.email, $options: "i" };
  User.findOne({ email: test.email })
    .then((doc) => {
      // console.log(doc)
      res.status(200).json({ data: doc });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

router.post("/getMember", (req, res, next) => {
  let postData = req.body;
  User.findOne({ eksplode_code: postData.eksplode_code })
    .then((doc) => {
      if (!doc) {
        res.status(500).json({ message: "Member does not exist" });
      } else {
        res.status(200).send({ user: doc._id, message: "Member Exists" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

/* @route		POST /user/password/forgot
 * @desc		Send Email to user's email
 * @body		{email,vac?,eac?,eksplode_code?}
 */

router.post("/password/forgot", async (req, res) => {
  let { email } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (!user) {
      res.status(400).json({ message: "Email cannnot be sent" });
    }
    const token = user.getResetPasswordToken();

    const resetToken = crypto.createHash("sha256").update(token).digest("hex");
    const test = await User.findOneAndUpdate(
      { _id: user._id },
      {
        resetPasswordToken: resetToken,
        resetPasswordExpire: Date.now() + 10 * (60 * 1000),
      },
      { new: true, useFindAndModify: false }
    );
    const resetUrl = req.body.vac
      ? `${process.env.FRONTEND_VAC}/password/reset/${resetToken}`
      : req.body.eac
      ? `${process.env.FRONTEND_EAC}/password/reset/${resetToken}`
      : req.body.eksplode_code
      ? `${process.env.FRONTEND_EKSPLODE_CODE}/password/reset/${resetToken}`
      : `localhost:3000/password/reset/${resetToken}`;
    const message = `Kindly follow the link to reset your password`;
    try {
      await sendLink(user.email, {
        email: user.email,
        link: resetUrl,
        message: message,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      throw new Error("Email can not be sent");
    }
    res.status(200).json({ success: true, data: "Email Sent" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* @route		PUT /user/password/reset/:token
 * @desc		Reset user Password
 * @body		{ password }
 */

router.put("/password/reset/:resetToken", async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.resetToken,
      resetPasswordExpire: { $gte: Date.now() },
    });
    if (!user) {
      throw new Error("invalid req");
    }
    try {
      await User.findByIdAndUpdate(
        { _id: user._id },
        {
          resetPasswordToken: undefined,
          resetPasswordExpire: undefined,
          password: bcrypt.hashSync(req.body.password, 10),
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Password reset successful",
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

//delete user
router.delete("/:id", (req, res) => {
  User.FindOneAndDelete({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "User Deleted" }))
    .catch((err) => res.status(400));
});
module.exports = router;
