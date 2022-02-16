import env from './.env';

export const environment = {
  production: true,
  IsConsoleLog : false,
  daUrl: 'https://quantumqa-soe.wipro.com/DA',
  daApiBaseUrl : 'https://quapi-qa.wipro.com/L2O.DA.Api/api/',
  version: env.npm_package_version,
  serverUrl: '',
  envName: 'MOBILEQA',
  encryptFlag : true,
  encDecConfig: {
    key: "DecryptionDecrip"
  },
  outLookUrl: 'https://outlook.office365.com',
  l2oBaseUrl: 'https://quapi-qa.wipro.com/L2O.Sprint1_2.Api/api/',
  l2oBaseUrlOpportunityDecript: 'https://quapi-qa.wipro.com/L2O.Sprint4.Api/api/',
  l2oBaseUrlOpportunity: 'https://quapi-qa.wipro.com/L2O.Sprint4.Api/api/',
  toolkitUrl: 'https://rsappsqa.wipro.com/',
  syncredirect: '',
  // l2oBaseUrlOpportunity : 'https://quapi-qa.wipro.com/L2O.Sprint4.Api_Encrypt/api/',
  // syncredirect: '',
  l2oBaseUrlOrder: 'https://quapi-qa.wipro.com/L2O.Sprint7.Api/api/',
  l3oBaseUrl: 'https://quapi-qa.wipro.com/L2O.Sprint3.Api/api/',
  CommonBaseUrl: 'https://quapi-qa.wipro.com/L2O.Common.Services.Api/api/',
  l2oFileUploadBaseUrl: 'https://quapi-qa.wipro.com/L2O.Common.Services.Api/api/v1/StorageCommon/UploadDocument_V_1',
  // camunda_BASE_URL: 'https://10.235.80.158:', //'http://10.200.35.38:4500/',
  camunda_BASE_URL: 'https://camundaqa.wipro.com:', //'http://10.200.35.38:4500/',
  camundaPorts: {
    'create': '4501', 'modif': '9090', 'assign': '6060', 'reserve': '7070', reminder: '4505',
    salesOrder: '4503',
    IFandCO: '4517',
    orderModification: '4520'
  },
  accountPlanUrl: 'https://accountplanuat.wipro.com',
  userHash: true,
  outlookConfig: {
    instance: 'https://login.microsoftonline.com/',
    tenant: '258ac4e4-146a-411e-9dc8-79a9e12fd6da',
    clientId: 'd37e5901-9e1f-4142-85e6-09abc618dae6',
    redirectUri: 'https://quantumqa-soe.wipro.com',
    response_mode: "id_token+token",
    postLogoutRedirectUri: 'https://quantumqa-soe.wipro.com',
    endpoints: {
      'https://outlook.office365.com': "https://outlook.office365.com",
      'https://analysis.windows.net/powerbi/api': 'https://analysis.windows.net/powerbi/api'
    },
    navigateToLoginRequestUrl: false,
  },
  authConfig: {
    domainUrl: 'https://wipfsuat01.wipro.com/adfs',
    loginUrl: 'https://wipfsuat01.wipro.com/adfs/oauth2/authorize?response_type=code&client_id=75917d72-7985-4d35-8243-c13a3e2b1b02&redirect_uri=https%3A%2F%2Fquantumlistclient%2Fauth%2Fredirect&scope=openid%20&resource=https%3A%2F%2Fquantumqa.wipro.com%2Fapi%2Fdata%2Fv9.0%2F',
    logoutUrl: 'https://wipfsuat01.wipro.com/adfs/oauth2/logout',
    redirectUrl: 'https://quantumlistclient/auth/redirect',//'https://l20-mockjson.azurewebsites.net/auth/redirect'
    //clientId: 'ef6d9135-e4d0-4e4b-acbb-fd81e5e45cf9',
    scope: '',
    resource: 'https://quantumqa.wipro.com/api/data/v9.0/',
    responseType: 'code',
    tokenEndpoint: 'https://wipfsuat01.wipro.com/adfs/oauth2/token',
    requestAccessToken: true,
    grantType: 'authorization_code',
    clientSecret: 'REgRWDcqtecbSvvVlvSdLKQoBuwvDzC16XM4tkhC',
    clientId: '75917d72-7985-4d35-8243-c13a3e2b1b02',//'21fad7f8-20fd-48fb-8f88-7bb306a9f8f4',
    key: 'Gjpn9-Jc9ZCOzskrw0tEu5Bj35T5kiU_KtyjpwZy',//'3qFLLagz88665aM0iw6yWZUOjSywikHTWJKzoqke',
    url: 'https://quantumqa.wipro.com/'
  },

  // Sprint 5 QA Base URL starts here
  sprint5BaseUrl: {
    QaURL5A: 'https://quapi-qa.wipro.com/L2O.Sprint5A.Api/',
    QaURL: "https://quantumdps-qa.wipro.com/QA.ALLIED.DPS/",
    QaURL4: "https://quapi-qa.wipro.com/L20.Sprint4.Api_Encrypt/",
    genaralFileUpLoad: 'https://quapi-qa.wipro.com/L2O.Common.Services.Api/api/v1/StorageCommon/UploadDocument_V_1',
    //  uploaddoc: 'https://quapi-qa.wipro.com/L2O.Common.Services.Api/api/v1/StorageCommon/UploadDocument_V_1',
    uploaddoc: 'https://quapi-qa.wipro.com/L2O.Sprint1_2.Api/api/Storage/UploadDocument'
  },
  wittyParrotIframe: 'https://mock-tokenhandler.azurewebsites.net/QA/index.html',
  daCommunicationUrl: 'https://quantumqa-soe.wipro.com',
  enableCipher: true
  // Sprint 5 QA Base URL ends here

};
