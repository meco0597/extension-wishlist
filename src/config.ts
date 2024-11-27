const config = {
    // REQUIRED
    appName: "Extension Wishlist",
    // REQUIRED: a short description of your app for SEO tags (can be overwritten)
    appDescription:
        "Instantly Qualify Leads and Increase Your Conversion Rate with automated AI agents.",
    // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
    domainName: "zaplead.io",
    stripe: {
        // Create multiple plans in your Stripe dashboard, then add them here. You can add as many plans as you want, just make sure to add the priceId
        plans: [
            {
                // REQUIRED — we use this to find the plan in the webhook (for instance if you want to update the user's credits based on the plan)
                priceId:
                    process.env.NODE_ENV === "development"
                        ? "price_1Niyy5AxyNprDp7iZIqEyD2h"
                        : "price_456",
                //  REQUIRED - Name of the plan, displayed on the pricing page
                name: "Starter",
                // A friendly description of the plan, displayed on the pricing page. Tip: explain why this plan and not others
                description: "Perfect for small projects",
                // The price you want to display, the one user will be charged on Stripe.
                price: 99,
                // If you have an anchor price (i.e. $29) that you want to display crossed out, put it here. Otherwise, leave it empty
                priceAnchor: 149,
                features: [
                    {
                        name: "NextJS boilerplate",
                    },
                    { name: "User oauth" },
                    { name: "Database" },
                    { name: "Emails" },
                ],
            },
            {
                priceId:
                    process.env.NODE_ENV === "development"
                        ? "price_1O5KtcAxyNprDp7iftKnrrpw"
                        : "price_456",
                // This plan will look different on the pricing page, it will be highlighted. You can only have one plan with isFeatured: true
                isFeatured: true,
                name: "Advanced",
                description: "You need more power",
                price: 149,
                priceAnchor: 299,
                features: [
                    {
                        name: "NextJS boilerplate",
                    },
                    { name: "User oauth" },
                    { name: "Database" },
                    { name: "Emails" },
                    { name: "1 year of updates" },
                    { name: "24/7 support" },
                ],
            },
        ],
    },
    aws: {
        // If you use AWS S3/Cloudfront, put values in here
        bucket: "bucket-name",
        bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
        cdn: "https://cdn-id.cloudfront.net/",
    },
    mailgun: {
        // subdomain to use when sending emails, if you don't have a subdomain, just remove it. Highly recommended to have one (i.e. mg.yourdomain.com or mail.yourdomain.com)
        subdomain: "mg",
        // REQUIRED — Email 'From' field to be used when sending magic login links
        fromNoReply: `ShipFast <noreply@mg.shipfa.st>`,
        // REQUIRED — Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
        fromAdmin: `Marc at ShipFast <marc@mg.shipfa.st>`,
        // Email shown to customer if need support. Leave empty if not needed => if empty, set up Crisp above, otherwise you won't be able to offer customer support."
        supportEmail: "support@zaplead.io",
        // When someone replies to supportEmail sent by the app, forward it to the email below (otherwise it's lost). If you set supportEmail to empty, this will be ignored.
        forwardRepliesTo: "marc.louvion@gmail.com",
    },
    auth: {
        // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
        loginUrl: "/api/auth/signin",
        // REQUIRED — the path you want to redirect users after successfull login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
        callbackUrl: "/dashboard",
    },
    firebaseAppName: "extension-wishlist"
};

export default config;