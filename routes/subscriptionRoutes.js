const express = require('express');
const router = express.Router();
const logger = require('../config/logger');
const { 
    User,
    OauthProvider,
    UserOauthAccount,
    UserSession,
    LoginAttempt,
    SubscriptionPlan,
    Subscription,
    PaymentMethod,
    Invoice,
    Payment,
    Coupon,
    SubscriptionCoupon,
    SubscriptionEvent 
} = require('../models/subscription');

// Generic CRUD functions
const create = (model) => async (req, res) => {
    try {
        const record = await model.create(req.body);
        res.status(201).json(record);
    } catch (error) {
        logger.error(`Error creating ${model.name}`, { error: error.message, body: req.body });
        res.status(400).json({ error: error.message });
    }
};

const getAll = (model) => async (req, res) => {
    try {
        const records = await model.findAll();
        res.json(records);
    } catch (error) {
        logger.error(`Error getting all ${model.name}s`, { error: error.message });
        res.status(500).json({ error: error.message });
    }
};

const getById = (model) => async (req, res) => {
    try {
        const record = await model.findByPk(req.params.id);
        if (record) {
            res.json(record);
        } else {
            res.status(404).json({ error: `${model.name} not found` });
        }
    } catch (error) {
        logger.error(`Error getting ${model.name} by id`, { error: error.message, params: req.params });
        res.status(500).json({ error: error.message });
    }
};

const update = (model) => async (req, res) => {
    try {
        const [updated] = await model.update(req.body, {
            where: { id: req.params.id },
        });
        if (updated) {
            const updatedRecord = await model.findByPk(req.params.id);
            res.json(updatedRecord);
        } else {
            res.status(404).json({ error: `${model.name} not found` });
        }
    } catch (error) {
        logger.error(`Error updating ${model.name}`, { error: error.message, params: req.params, body: req.body });
        res.status(400).json({ error: error.message });
    }
};

const remove = (model) => async (req, res) => {
    try {
        const deleted = await model.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: `${model.name} not found` });
        }
    } catch (error) {
        logger.error(`Error deleting ${model.name}`, { error: error.message, params: req.params });
        res.status(500).json({ error: error.message });
    }
};

// Routes for each model
const models = {
    users: User,
    oauth_providers: OauthProvider,
    user_oauth_accounts: UserOauthAccount,
    user_sessions: UserSession,
    login_attempts: LoginAttempt,
    subscription_plans: SubscriptionPlan,
    subscriptions: Subscription,
    payment_methods: PaymentMethod,
    invoices: Invoice,
    payments: Payment,
    coupons: Coupon,
    subscription_coupons: SubscriptionCoupon,
    subscription_events: SubscriptionEvent
};

for (const modelName in models) {
    const model = models[modelName];
    router.post(`/${modelName}`, create(model));
    router.get(`/${modelName}`, getAll(model));
    router.get(`/${modelName}/:id`, getById(model));
    router.put(`/${modelName}/:id`, update(model));
    router.delete(`/${modelName}/:id`, remove(model));
}

module.exports = router;