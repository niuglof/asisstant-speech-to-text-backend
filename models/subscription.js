const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user');
const ApiKey = require('./ApiKey');

const OauthProvider = sequelize.define('OauthProvider', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    display_name: { type: DataTypes.STRING(100), allowNull: false },
    client_id: { type: DataTypes.STRING(255), allowNull: false },
    client_secret: { type: DataTypes.STRING(255) },
    authorization_url: { type: DataTypes.STRING(500), allowNull: false },
    token_url: { type: DataTypes.STRING(500), allowNull: false },
    user_info_url: { type: DataTypes.STRING(500), allowNull: false },
    scope: { type: DataTypes.STRING(500), defaultValue: 'openid email profile' },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'oauth_providers', timestamps: true, paranoid: true, createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at' });

const UserOauthAccount = sequelize.define('UserOauthAccount', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    user_id: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
    provider_id: { type: DataTypes.UUID, allowNull: false, references: { model: OauthProvider, key: 'id' } },
    provider_user_id: { type: DataTypes.STRING(255), allowNull: false },
    provider_email: { type: DataTypes.STRING(255) },
    access_token: { type: DataTypes.TEXT },
    refresh_token: { type: DataTypes.TEXT },
    token_expires_at: { type: DataTypes.DATE },
    scope: { type: DataTypes.STRING(500) },
    provider_data: { type: DataTypes.JSONB },
    connected_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    last_used_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'user_oauth_accounts', timestamps: true, paranoid: true, createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at' });

const UserSession = sequelize.define('UserSession', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    user_id: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
    session_token: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    oauth_account_id: { type: DataTypes.UUID, references: { model: UserOauthAccount, key: 'id' } },
    ip_address: { type: DataTypes.INET },
    user_agent: { type: DataTypes.TEXT },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    last_activity_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'user_sessions', timestamps: true, paranoid: true, createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at' });

const LoginAttempt = sequelize.define('LoginAttempt', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    email: { type: DataTypes.STRING(255) },
    msisdn: { type: DataTypes.STRING(15) },
    ip_address: { type: DataTypes.INET, allowNull: false },
    user_agent: { type: DataTypes.TEXT },
    success: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    failure_reason: { type: DataTypes.STRING(100) },
    oauth_provider: { type: DataTypes.STRING(50) },
    attempted_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'login_attempts', timestamps: false });

const SubscriptionPlan = sequelize.define('SubscriptionPlan', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    name: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency: { type: DataTypes.STRING(3), defaultValue: 'USD' },
    billing_period: { type: DataTypes.STRING(20), allowNull: false },
    billing_interval: { type: DataTypes.INTEGER, defaultValue: 1 },
    trial_period_days: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    features: { type: DataTypes.JSONB },
}, { tableName: 'subscription_plans', timestamps: true, paranoid: true, createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at' });

const Subscription = sequelize.define('Subscription', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    user_id: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
    plan_id: { type: DataTypes.UUID, allowNull: false, references: { model: SubscriptionPlan, key: 'id' } },
    status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'active' },
    start_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    end_date: { type: DataTypes.DATE },
    trial_start: { type: DataTypes.DATE },
    trial_end: { type: DataTypes.DATE },
    current_period_start: { type: DataTypes.DATE, allowNull: false },
    current_period_end: { type: DataTypes.DATE, allowNull: false },
    cancel_at_period_end: { type: DataTypes.BOOLEAN, defaultValue: false },
    canceled_at: { type: DataTypes.DATE },
    metadata: { type: DataTypes.JSONB },
}, { tableName: 'subscriptions', timestamps: true, paranoid: true, createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at' });

const PaymentMethod = sequelize.define('PaymentMethod', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    user_id: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
    type: { type: DataTypes.STRING(20), allowNull: false },
    provider: { type: DataTypes.STRING(50), allowNull: false },
    provider_payment_method_id: { type: DataTypes.STRING(255), allowNull: false },
    is_default: { type: DataTypes.BOOLEAN, defaultValue: false },
    card_last_four: { type: DataTypes.STRING(4) },
    card_brand: { type: DataTypes.STRING(20) },
    card_exp_month: { type: DataTypes.INTEGER },
    card_exp_year: { type: DataTypes.INTEGER },
    paypal_email: { type: DataTypes.STRING(255) },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'payment_methods', timestamps: true, paranoid: true, createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at' });

const Invoice = sequelize.define('Invoice', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    subscription_id: { type: DataTypes.UUID, allowNull: false, references: { model: Subscription, key: 'id' } },
    invoice_number: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'pending' },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency: { type: DataTypes.STRING(3), defaultValue: 'USD' },
    tax_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    discount_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    issue_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    due_date: { type: DataTypes.DATE, allowNull: false },
    paid_at: { type: DataTypes.DATE },
    period_start: { type: DataTypes.DATE, allowNull: false },
    period_end: { type: DataTypes.DATE, allowNull: false },
    external_invoice_id: { type: DataTypes.STRING(255) },
    payment_method_id: { type: DataTypes.UUID, references: { model: PaymentMethod, key: 'id' } },
}, { tableName: 'invoices', timestamps: true, paranoid: true, createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at' });

const Payment = sequelize.define('Payment', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    invoice_id: { type: DataTypes.UUID, allowNull: false, references: { model: Invoice, key: 'id' } },
    payment_method_id: { type: DataTypes.UUID, allowNull: false, references: { model: PaymentMethod, key: 'id' } },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency: { type: DataTypes.STRING(3), defaultValue: 'USD' },
    status: { type: DataTypes.STRING(20), allowNull: false },
    external_payment_id: { type: DataTypes.STRING(255) },
    provider: { type: DataTypes.STRING(50), allowNull: false },
    failure_reason: { type: DataTypes.TEXT },
    processed_at: { type: DataTypes.DATE },
}, { tableName: 'payments', timestamps: true, paranoid: true, createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at' });

const Coupon = sequelize.define('Coupon', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    type: { type: DataTypes.STRING(20), allowNull: false },
    value: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency: { type: DataTypes.STRING(3) },
    valid_from: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    valid_until: { type: DataTypes.DATE },
    max_uses: { type: DataTypes.INTEGER },
    current_uses: { type: DataTypes.INTEGER, defaultValue: 0 },
    minimum_amount: { type: DataTypes.DECIMAL(10, 2) },
    applicable_plans: { type: DataTypes.ARRAY(DataTypes.UUID) },
    first_time_only: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'coupons', timestamps: true, paranoid: true, createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at' });

const SubscriptionCoupon = sequelize.define('SubscriptionCoupon', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    subscription_id: { type: DataTypes.UUID, allowNull: false, references: { model: Subscription, key: 'id' } },
    coupon_id: { type: DataTypes.UUID, allowNull: false, references: { model: Coupon, key: 'id' } },
    applied_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    expires_at: { type: DataTypes.DATE },
}, { tableName: 'subscription_coupons', timestamps: false });

const SubscriptionEvent = sequelize.define('SubscriptionEvent', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    subscription_id: { type: DataTypes.UUID, allowNull: false, references: { model: Subscription, key: 'id' } },
    event_type: { type: DataTypes.STRING(50), allowNull: false },
    event_data: { type: DataTypes.JSONB },
}, { tableName: 'subscription_events', timestamps: true, paranoid: true, createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at' });

// Relationships
User.hasMany(UserOauthAccount, { foreignKey: 'user_id' });
UserOauthAccount.belongsTo(User, { foreignKey: 'user_id' });

OauthProvider.hasMany(UserOauthAccount, { foreignKey: 'provider_id' });
UserOauthAccount.belongsTo(OauthProvider, { foreignKey: 'provider_id' });

User.hasMany(UserSession, { foreignKey: 'user_id' });
UserSession.belongsTo(User, { foreignKey: 'user_id' });

UserOauthAccount.hasMany(UserSession, { foreignKey: 'oauth_account_id' });
UserSession.belongsTo(UserOauthAccount, { foreignKey: 'oauth_account_id' });

User.hasMany(Subscription, { foreignKey: 'user_id' });
Subscription.belongsTo(User, { foreignKey: 'user_id' });

SubscriptionPlan.hasMany(Subscription, { foreignKey: 'plan_id' });
Subscription.belongsTo(SubscriptionPlan, { foreignKey: 'plan_id' });

User.hasMany(PaymentMethod, { foreignKey: 'user_id' });
PaymentMethod.belongsTo(User, { foreignKey: 'user_id' });

Subscription.hasMany(Invoice, { foreignKey: 'subscription_id' });
Invoice.belongsTo(Subscription, { foreignKey: 'subscription_id' });

PaymentMethod.hasMany(Invoice, { foreignKey: 'payment_method_id' });
Invoice.belongsTo(PaymentMethod, { foreignKey: 'payment_method_id' });

Invoice.hasMany(Payment, { foreignKey: 'invoice_id' });
Payment.belongsTo(Invoice, { foreignKey: 'invoice_id' });

PaymentMethod.hasMany(Payment, { foreignKey: 'payment_method_id' });
Payment.belongsTo(PaymentMethod, { foreignKey: 'payment_method_id' });

Subscription.hasMany(SubscriptionCoupon, { foreignKey: 'subscription_id' });
SubscriptionCoupon.belongsTo(Subscription, { foreignKey: 'subscription_id' });

Coupon.hasMany(SubscriptionCoupon, { foreignKey: 'coupon_id' });
SubscriptionCoupon.belongsTo(Coupon, { foreignKey: 'coupon_id' });

Subscription.hasMany(SubscriptionEvent, { foreignKey: 'subscription_id' });
SubscriptionEvent.belongsTo(Subscription, { foreignKey: 'subscription_id' });

module.exports = {
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
    SubscriptionEvent,
    ApiKey
};