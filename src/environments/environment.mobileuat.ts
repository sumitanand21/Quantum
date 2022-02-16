import env from "./.env";
export const environment = {
  production: true,
  IsConsoleLog : false,
  version: env.npm_package_version,
  serverUrl: "",
  envName: "MOBILEQA",
  daApiBaseUrl : 'https://quantumpuat-api.wipro.com/L2O.DA.Api/api/',
  encryptFlag : true,
  encDecConfig: {
    key: "DecryptionDecrip"
  },
  outLookUrl: "https://outlook.office365.com",
  l2oBaseUrlOpportunityDecript:
    "https://quantumpuat-api.wipro.com/L2O.Sprint4.Api/api/",
  l2oBaseUrlOpportunity:
    "https://quantumpuat-api.wipro.com/L2O.Sprint4.Api/api/",
  toolkitUrl: "https://rsappspreuat.wipro.com/",
  l2oBaseUrl: "https://quantumpuat-api.wipro.com/L2O.Sprint1_2.Api/api/",
  syncredirect: "",
  l3oBaseUrl: "https://quantumpuat-api.wipro.com/L2O.Sprint3.Api/api/",
  CommonBaseUrl: "https://quapi-qa.wipro.com/L2O.Common.Services.Api/api/",
  l2oFileUploadBaseUrl:
    "https://quantumpuat-api.wipro.com/L2O.Common.Services.Api/api/v1/StorageCommon/UploadDocument_V_1",
  l2oBaseUrlOrder: "https://quantumpuat-api.wipro.com/L2O.Sprint7.Api/api/",

  // camunda_BASE_URL: "https://AZSG-P-CAM01.wipro.com:", //'http://10.200.35.38:4500/',
  camunda_BASE_URL: "https://AZSG-QTL2O-CAM.wipro.com:",
  accountPlanUrl : 'https://accuat.wipro.com',
  camundaPorts: {
    create: "6061",
    modif: "6063",
    assign: "6062",
    reserve: "6063",
    reminder: '6069',
    salesOrder: '6066',
    IFandCO: '6067',
    orderModification:'6068'
  },
  userHash: true,
  outlookConfig: {
    instance: "https://login.microsoftonline.com/",
    tenant: "258ac4e4-146a-411e-9dc8-79a9e12fd6da",
    clientId: "d37e5901-9e1f-4142-85e6-09abc618dae6",
    redirectUri: "https://quantumpuat-soe.wipro.com",
    response_mode: "id_token+token",
    postLogoutRedirectUri: "https://quantumpuat-soe.wipro.com",
    endpoints: {
      "https://outlook.office365.com": "https://outlook.office365.com",
      "https://analysis.windows.net/powerbi/api":
        "https://analysis.windows.net/powerbi/api"
    },
    navigateToLoginRequestUrl: false
  },
  authConfig: {
    domainUrl: "https://wipfsuat01.wipro.com/adfs",
    loginUrl:
      "https://wipfsuat01.wipro.com/adfs/oauth2/authorize?response_type=code&client_id=b43501bc-e1a0-4a91-ad3c-d50550e6cade&redirect_uri=https%3A%2F%2FquantumlistclientPreuat%2Fauth%2Fredirect&scope=openid%20&resource=https%3A%2F%2Fquantumu.wipro.com%2Fapi%2Fdata%2Fv9.0%2F",
    logoutUrl: "https://wipfsuat01.wipro.com/adfs/oauth2/logout",
    redirectUrl: "https://quantumlistclientPreuat/auth/redirect", //'https://l2o-app.azurewebsites.net'
    //clientId: 'ef6d9135-e4d0-4e4b-acbb-fd81e5e45cf9',
    scope: "",
    resource: "https://quantumu.wipro.com/api/data/v9.0/",
    responseType: "code",
    tokenEndpoint: "https://wipfsuat01.wipro.com/adfs/oauth2/token",
    requestAccessToken: true,
    grantType: "authorization_code",
    clientSecret: "Bv_NOBsLyb9tphXdLkA7yZ77aUHTm_rSwYTQ6Hyr",
    clientId: "52d6b7da-9ef9-4521-821b-1a7ba5795c5a", //'21fad7f8-20fd-48fb-8f88-7bb306a9f8f4',
    key: "Gjpn9-Jc9ZCOzskrw0tEu5Bj35T5kiU_KtyjpwZy", //'3qFLLagz88665aM0iw6yWZUOjSywikHTWJKzoqke',
    url: "https://quantumput.wipro.com/"
  },

  // Sprint 5 QA Base URL starts here
  sprint5BaseUrl: {
    QaURL5A: "https://quantumpuat-api.wipro.com/L2O.Sprint5A.Api/",
    // QaURL: "https://qunatumdpsapi-preuat.wipro.com/PUAT.ALLIED.DPS/",
    QaURL: "https://qunatumdpsapi-preuat.wipro.com/PUAT.ALLIED.DPS/",
    QaURL4: "https://quapi-qa.wipro.com/L20.Sprint4.Api_Encrypt/",
    genaralFileUpLoad:
      "https://quapi-qa.wipro.com/L2O.Common.Services.Api/api/v1/StorageCommon/UploadDocument_V_1",
    uploaddoc:
      "https://quapi-dev.wipro.com/L2O.Sprint1_2.Api/api/Storage/UploadDocument"
  },
  wittyParrotIframe: "https://mock-tokenhandler.azurewebsites.net/index.html",
  WittyIframe: "http://localhost:4321/",
  // Sprint 5 QA Base URL ends here
  daUrl: "https://quantumpuat-soe.wipro.com/DA",
  daCommunicationUrl: "https://quantumpuat-soe.wipro.com",
  enableCipher: true
};
