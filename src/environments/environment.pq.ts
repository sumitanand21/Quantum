import env from "./.env";
export const environment = {
  production: true,
  IsConsoleLog : false,
  daUrl: "https://quantumpq-soe.wipro.com/DA",
  daApiBaseUrl : 'https://quantumpq-api.wipro.com/L2O.DA.Api/api/',
  version: env.npm_package_version,
  serverUrl: "",
  envName: "PQ",
  encryptFlag : false,
  encDecConfig: {
    key: "DecryptionDecrip"
  },
  outLookUrl: "https://outlook.office365.com",
  l2oBaseUrlOpportunityDecript:
    "https://quantumpq-sos.wipro.com/L2O.Sprint4.Api/api/",
  l2oBaseUrlOpportunity: "https://quantumpq-sos.wipro.com/L2O.Sprint4.Api/api/",
  toolkitUrl: "https://rsappsqa.wipro.com/",
  // l2oBaseUrlOpportunity : 'https://quantumpq-sos.wipro.com/L2O.Sprint4.Api_Encrypt/api/',
  accountPlanUrl : 'https://accountplanuat.wipro.com',
  syncredirect: "https://quantumpq-soe.wipro.com",

  l2oBaseUrlOrder: "https://quantumpq-sos.wipro.com/L2O.Sprint7.Api/api/",
  l2oBaseUrl: "https://quantumpq-sos.wipro.com/L2O.Sprint1_2.Api/api/",
  l3oBaseUrl: "https://quantumpq-sos.wipro.com/L2O.Sprint3.Api/api/",
  l2oFileUploadBaseUrl:
    "https://quantumpq-sos.wipro.com/L2O.Sprint1_2.Api/api/Storage/UploadDocument",
  camunda_BASE_URL: "https://camundaqa.wipro.com:", //'http://10.200.35.38:4500/',
  camundaPorts: {
    create: "8051",
    modif: "8052",
    assign: "6060",
    reserve: "7070",
    reminder: '4505',
    salesOrder: '4503',
    IFandCO: '4517',
    orderModification:'4520'
  },
  CommonBaseUrl: "https://quantumpq-sos.wipro.com/L2O.Common.Services.Api/api/",
  userHash: false,
  outlookConfig: {
    instance: "https://login.microsoftonline.com/",
    tenant: "258ac4e4-146a-411e-9dc8-79a9e12fd6da",
    clientId: "d37e5901-9e1f-4142-85e6-09abc618dae6",
    redirectUri: "https://quantumpq-soe.wipro.com",
    response_mode: "id_token+token",
    postLogoutRedirectUri: "https://quantumpq-soe.wipro.com",
    endpoints: {
      "https://outlook.office365.com": "https://outlook.office365.com",
      "https://analysis.windows.net/powerbi/api":
        "https://analysis.windows.net/powerbi/api"
    },
    navigateToLoginRequestUrl: false
  },
  authConfig: {
    domainUrl: "https://wipfsuat01.wipro.com/adfs",
    loginUrl: "https://wipfsuat01.wipro.com/adfs/oauth2/authorize",
    logoutUrl: "https://wipfsuat01.wipro.com/adfs/oauth2/logout",
    redirectUrl: "https://quantumpq-soe.wipro.com/auth/redirect",
    //clientId: 'ef6d9135-e4d0-4e4b-acbb-fd81e5e45cf9',
    scope: "",
    resource: "https://quantumpq.wipro.com/api/data/v9.0/",
    responseType: "code",
    tokenEndpoint: "https://wipfsuat01.wipro.com/adfs/oauth2/token",
    requestAccessToken: true,
    grantType: "authorization_code",
    clientSecret: "7E2fZxiCAziojs8O7vbJ_xujbs1sTQjngQrlo5v_",
    clientId: "58c2eeb3-e9f8-4af9-9bbc-80760588dfb4", 
    key: "Gjpn9-Jc9ZCOzskrw0tEu5Bj35T5kiU_KtyjpwZy", 
    url: "https://quantumpq.wipro.com/"
  },

  // Sprint 5 dev Base URL starts here
  sprint5BaseUrl: {
    QaURL5A: "https://quantumpq-sos.wipro.com/L2O.Sprint5A.Api/",
    QaURL: "https://quantumpq-sos.wipro.com/PQ.ALLIED.DPS/",
    QaURL4: "https://quantumpq-sos.wipro.com/L2O.Sprint4.Api/",
    genaralFileUpLoad:
      "https://quantumpq-sos.wipro.com/L2O.Common.Services.Api/api/v1/StorageCommon/UploadDocument_V_1",
    uploaddoc:
      "https://quantumpq-sos.wipro.com/L2O.Sprint1_2.Api/api/Storage/UploadDocument"
  },
  wittyParrotIframe: "https://mock-tokenhandler.azurewebsites.net/index.html",
  daCommunicationUrl: "https://quantumpq-soe.wipro.com",
  enableCipher: false
  // Sprint 5 dev Base URL ends here
};
