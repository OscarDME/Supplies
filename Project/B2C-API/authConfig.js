const passportConfig = {
    credentials: {
        tenantName: 'FitHubMX.onmicrosoft.com',
        clientID: 'e14bbfac-bbfd-4b98-984f-de2e43337185',
    },
    policies: {
        policyName: 'B2C_1_FitHub_Login',
    },
    metadata: {
        b2cDomain: 'FitHubMX.b2clogin.com',
        authority: 'login.microsoftonline.com',
        discovery: '.well-known/openid-configuration',
        version: 'v2.0',
    },
    settings: {
        isB2C: true,
        validateIssuer: false,
        passReqToCallback: true,
        loggingLevel: 'info',
        loggingNoPII: false,
    },
    protectedRoutes: {
        todolist: {
            endpoint: '/tasks-api',
            delegatedPermissions: {
                read: ['tasks.read'],
                write: ['tasks.Write'],
            },
        },
    },
};

module.exports = passportConfig;

