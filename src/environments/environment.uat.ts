import env from "./.env";
export const environment = {
  production: true,
  //IsConsoleLog : true,
  // daUrl: "https://quantumuat-soe.wipro.com/DA",
  // daApiBaseUrl : 'https://quantumuat-sos.wipro.com/L2O.DA.Api/api/', 
  version: env.npm_package_version,
  // serverUrl: "",
  envName: "UAT",
  encryptFlag : true,
  encDecConfig: {
    key: "DecryptionDecrip"
  },
  // outLookUrl: "https://outlook.office365.com",
  // l2oBaseUrlOpportunityDecript:
  //   "https://quantumuat-sos.wipro.com/L2O.Sprint4.Api/api/",
  // l2oBaseUrlOpportunity:
  //   "https://quantumuat-sos.wipro.com/L2O.Sprint4.Api/api/",
  // toolkitUrl: "https://rsappsuat.wipro.com/",
  // l2oBaseUrl: "https://quantumuat-sos.wipro.com/L2O.Sprint1_2.Api/api/",
  // syncredirect: "https://quantumuat-soe.wipro.com/",
  // l3oBaseUrl: "https://quantumuat-sos.wipro.com/L2O.Sprint3.Api/api/",
  // CommonBaseUrl: "https://quapi-qa.wipro.com/L2O.Common.Services.Api/api/",
  // l2oFileUploadBaseUrl:
  //   "https://quantumuat-sos.wipro.com/L2O.Sprint1_2.Api/api/Storage/UploadDocument",
  // l2oBaseUrlOrder: "https://quantumuat-sos.wipro.com/L2O.Sprint7.Api/api/",

  // camunda_BASE_URL: "https://AZSG-P-CAM01.wipro.com:",
  // camunda_BASE_URL: "https://azsg-p-cmnduat.wipro.com:", //'http://10.200.35.38:4500/',

  // camundaPorts: {
  //   create: "6061",
  //   modif: "6063",
  //   assign: "6062",
  //   reserve: "6063",
  //   reminder: '6069',
  //   salesOrder: '6066',
  //   IFandCO: '6067',
  //   orderModification:'6068'
  // },
  // accountPlanUrl: 'https://accuat.wipro.com',
  userHash: false,
  // outlookConfig: {
  //   instance: "https://login.microsoftonline.com/",
  //   tenant: "258ac4e4-146a-411e-9dc8-79a9e12fd6da",
  //   clientId: "d37e5901-9e1f-4142-85e6-09abc618dae6",
  //   redirectUri: "https://quantumuat-soe.wipro.com",
  //   response_mode: "id_token+token",
  //   postLogoutRedirectUri: "https://quantumuat-soe.wipro.com",
  //   endpoints: {
  //     "https://outlook.office365.com": "https://outlook.office365.com",
  //     "https://analysis.windows.net/powerbi/api":
  //       "https://analysis.windows.net/powerbi/api"
  //   },
  //   navigateToLoginRequestUrl: false
  // },
  // authConfig: {
  //   domainUrl: "https://wipfsuat01.wipro.com/adfs",
  //   loginUrl: "https://wipfsuat01.wipro.com/adfs/oauth2/authorize",
  //   logoutUrl: "https://wipfsuat01.wipro.com/adfs/oauth2/logout",
  //   redirectUrl: "https://quantumuat-soe.wipro.com/auth/redirect", //'https://l2o-app.azurewebsites.net'
  //   //clientId: 'ef6d9135-e4d0-4e4b-acbb-fd81e5e45cf9',
  //   scope: "",
  //   resource: "https://quantumutwo.wipro.com/api/data/v9.0/",
  //   responseType: "code",
  //   tokenEndpoint: "https://wipfsuat01.wipro.com/adfs/oauth2/token",
  //   requestAccessToken: true,
  //   grantType: "authorization_code",
  //   clientSecret: "zUC4vgtXXjsiunp5NHdtPgdtjkHLEJSOlx0N_OjB",
  //   clientId: "91c0f146-7615-460b-b82b-9f488f1dc3e0", 
  //   key: "Gjpn9-Jc9ZCOzskrw0tEu5Bj35T5kiU_KtyjpwZy",
  //   url: "https://quantumutwo.wipro.com/"
  // },

  // Sprint 5 dev Base URL starts here
  // sprint5BaseUrl: {
  //   // replace with puat url
  //   QaURL5A: "https://quantumuat-sos.wipro.com/L2O.Sprint5A.Api/",
  //   // QaURL: "https://qunatumdpsapi-preuat.wipro.com/PUAT.ALLIED.DPS/",
  //   QaURL: "https://quantumuat-sos.wipro.com/UAT.ALLIED.DPS/",
  //   QaURL4: "https://quapi-dev.wipro.com/L2O.Sprint4.Api/",
  //   genaralFileUpLoad:
  //     "https://quapi-dev.wipro.com/L2O.Common.Services.Api/api/v1/StorageCommon/UploadDocument_V_1",
  //   uploaddoc:
  //     "https://quapi-dev.wipro.com/L2O.Sprint1_2.Api/api/Storage/UploadDocument"
  // },
  // Sprint 5 dev Base URL ends here
  // wittyParrotIframe:
    // "https://mock-tokenhandler.azurewebsites.net/QA/index.html",
  // daCommunicationUrl: "https://quantumuat-soe.wipro.com",
  enableCipher: true
};
