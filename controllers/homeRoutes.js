const router = require("express").Router();
const {
  Category,
  Thread,
  Post,
  User,
  Group,
  GroupMembership,
  Message,
  Subscription,
} = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    if (req.session.logged_in) {
      const subscriptionData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Thread,
            through: Subscription,
            as: "users_subscribed_threads",
          },
        ],
      });

      const postData = await Post.findAll({
        include: [
          {
            model: Thread,
            include: [
              {
                model: Category,
              },
            ],
          },
          { model: User },
        ],
        order: [["date_created", "DESC"]],
        limit: 10,
      });
      var posts = postData.map((post) => post.get({ plain: true }));

      // Serialize data so the template can read it
      var subs = subscriptionData.get({ plain: true });
    } else {
      var subs = null;
    }

    // Pass serialized data and session flag into template
    res.render("homepage", {
      logged_in: req.session.logged_in,
      subs,
      posts,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/categories", async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const categoryData = await Category.findAll({
      include: [
        {
          model: User,
          attributes: { exclude: ["password"] },
        },
      ],
    });

    const categories = categoryData.map((categorie) =>
      categorie.get({ plain: true })
    );

    if (req.session.logged_in) {
      const subscriptionData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Thread,
            through: Subscription,
            as: "users_subscribed_threads",
          },
        ],
      });

      // Serialize data so the template can read it
      var subs = subscriptionData.get({ plain: true });
    } else {
      var subs = null;
    }

    // Pass serialized data and session flag into template
    res.render("categories", {
      categories,
      subs,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/new-category", async (req, res) => {
  try {
    if (req.session.logged_in) {
      const subscriptionData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Thread,
            through: Subscription,
            as: "users_subscribed_threads",
          },
        ],
      });

      // Serialize data so the template can read it
      var subs = subscriptionData.get({ plain: true });
    } else {
      var subs = null;
    }

    res.render("new-category", {
      logged_in: req.session.logged_in,
      subs,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/new-thread", async (req, res) => {
  try {
    if (req.session.logged_in) {
      const subscriptionData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Thread,
            through: Subscription,
            as: "users_subscribed_threads",
          },
        ],
      });

      // Serialize data so the template can read it
      var subs = subscriptionData.get({ plain: true });
    } else {
      var subs = null;
    }

    res.render("new-thread", {
      logged_in: req.session.logged_in,
      subs,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/threads/:id", async (req, res) => {
  try {
    // Get all projects and JOIN with user data

    console.log("----------------------------------------9999");

    var nullThreads;

    const threadData = await Thread.findAll({
      include: [
        {
          model: User,
          attributes: { exclude: ["password"] },
        },
        {
          model: Category,
          where: { id: req.params.id },
        },
      ],
    });

    if (threadData.length === 0) {
      nullThreads = false;
    } else {
      nullThreads = true;
    }
    const categoryData = await Category.findByPk(req.params.id, {});

    // Serialize data so the template can read it
    var cat = categoryData.get({ plain: true });

    const threads = threadData.map((thread) => thread.get({ plain: true }));

    console.log(threads);

    if (req.session.logged_in) {
      const subscriptionData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Thread,
            through: Subscription,
            as: "users_subscribed_threads",
          },
        ],
      });

      // Serialize data so the template can read it
      var subs = subscriptionData.get({ plain: true });
    } else {
      var subs = null;
    }

    res.render("threads", {
      threads,
      subs,
      logged_in: req.session.logged_in,
      cat,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/thread/:id", async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const threadData = await Thread.findByPk(req.params.id, {
      include: [
        {
          model: Post,
          include: [
            {
              model: User,
              attributes: { exclude: ["password"] },
            },
          ],
        },
        {
          model: User,
          attributes: { exclude: ["password"] },
        },
        {
          model: Category,
        },
      ],
    });

    const thread = threadData.get({ plain: true });

    if (req.session.logged_in) {
      const subscriptionData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Thread,
            through: Subscription,
            as: "users_subscribed_threads",
          },
        ],
      });

      // Serialize data so the template can read it
      var subs = subscriptionData.get({ plain: true });

      var subscribed;
      var isCreator;
      //variables for subscription and freezing post

      var count = await Subscription.count({
        where: {
          thread_id: req.params.id,
          user_id: req.session.user_id,
        },
      });

      if (count) {
        subscribed = true;
      } else {
        subscribed = false;
      }

      var countCreator = await Thread.count({
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      });

      if (countCreator) {
        isCreator = true;
      } else {
        isCreator = false;
      }
    } else {
      var subs = null;

      var subscribed = false;
      var isCreator = false;
    }

    res.render("thread", {
      thread,
      subs,
      logged_in: req.session.logged_in,
      subscribed,
      isCreator,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  // If a session exists, redirect the request to the homepage

  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  var subs = null;

  res.render("login", {
    subs,
  });
});

module.exports = router;
