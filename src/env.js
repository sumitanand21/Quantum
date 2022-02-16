(function (window) {
  window.__env = window.__env || {};
  // API urlhttps://wipfsuat01.wipro.com
    var ADFSURL= "https://wipfsuat01.wipro.com/"; // Domian ADFS URL
    var SOSBaseURL= "https://quapi-dev.wipro.com/"; // Domian SOS URL
    var SOEBaseURL= "http://localhost:4200/"; // Domain SOE URL
    var CRMBaseURL= "https://quantumtwo.wipro.com/"; // Domain CRM URL
    
    window.__env.clientIdAuthConfig= "daf899ee-f6e6-4aa5-aac6-24e31516c7c9", // Client ID for ADFS
    window.__env.clientIdOutlookConfig= "d37e5901-9e1f-4142-85e6-09abc618dae6", // Client ID for AzureAD
    window.__env.maintainence= false, // for maintaience mode
    window.__env.enableUsers =['SH353200']

    window.__env.toolkitUrl =  "https://rsappsdev.wipro.com/",// Toolkit relation suite
    window.__env.accountPlanUrl = 'https://accountplanuat.wipro.com', // Account plan
 
    window.__env.camunda_BASE_URL = "https://camundaqa.wipro.com:", //Camunda
    window.__env.camundaPorts = { //Camunda ports
      create: "4501",
      modif: "9090",
      assign: "6060",
      reserve: "7070",
      reminder: '8057', // '4505',
      salesOrder: '8061',// '4503',
      IFandCO: '8062', //'4517',
      orderModification: '8063', //'4520'
    },

    window.__env.daUrl= "http://localhost:4321/", 
    window.__env.daApiBaseUrl= SOSBaseURL+"L2O.DA.Api/api/", 
    window.__env.serverUrl= "", 
    window.__env.outLookUrl= "https://outlook.office365.com",
    window.__env.l2oBaseUrlOpportunityDecript =  SOSBaseURL+"L2O.Sprint4.Api/api/",
    window.__env.l2oBaseUrlOpportunity =   SOSBaseURL+"L2O_3.5/L2O.Sprint4.Api_Encrypt/api/",

    window.__env.syncredirect = SOEBaseURL,
    window.__env.l2oBaseUrlOrder= SOSBaseURL+"L2O_3.5/L2O.Sprint7.Api/api/",
    window.__env.l2oBaseUrl= SOSBaseURL+"L2O_3.5/L2O.Sprint1_2.Api/api/",
    window.__env.l3oBaseUrl= SOSBaseURL+"L2O_3.5/L2O.Sprint3.Api/api/",
    window.__env.l2oFileUploadBaseUrl = SOSBaseURL+"L2O_3.5/L2O.Sprint1_2.Api/api/Storage/UploadDocument",
   
    window.__env.CommonBaseUrl= SOSBaseURL+"L2O.Common.Services.Api/api/",
    window.__env.outlookConfig = { // Azure AD Config Details
      instance: "https://login.microsoftonline.com/",
      tenant: "258ac4e4-146a-411e-9dc8-79a9e12fd6da",  
      //clientId: window.__env.clientIdAuthConfig,
      redirectUri: SOEBaseURL,
      response_mode: "id_token+token",
      postLogoutRedirectUri: SOEBaseURL,
      endpoints: {
        "https://outlook.office365.com": "https://outlook.office365.com",
        "https://analysis.windows.net/powerbi/api":
          "https://analysis.windows.net/powerbi/api"
      },
      navigateToLoginRequestUrl: false
    },
    window.__env.  authConfig = { //ADFS Config Details
      domainUrl: ADFSURL+"adfs",
      loginUrl: ADFSURL+"adfs/oauth2/authorize",
      logoutUrl: ADFSURL+"adfs/oauth2/logout",
      redirectUrl: SOEBaseURL+"auth/redirect", 
      //clientId: 'ef6d9135-e4d0-4e4b-acbb-fd81e5e45cf9',
      scope: "",
      resource: CRMBaseURL+"api/data/v9.0/",
      responseType: "code",
      tokenEndpoint: ADFSURL+"adfs/oauth2/token",
      requestAccessToken: true,
      grantType: "authorization_code",
      // clientSecret: "zUC4vgtXXjsiunp5NHdtPgdtjkHLEJSOlx0N_OjB",
      // clientId: "91c0f146-7615-460b-b82b-9f488f1dc3e0", 
      key: "Gjpn9-Jc9ZCOzskrw0tEu5Bj35T5kiU_KtyjpwZy",
      url: CRMBaseURL
    },
    window.__env.sprint5BaseUrl = {
      // replace with puat url
      QaURL5A: SOSBaseURL+"L2O_3.5/L2O.Sprint5A.Api/",
      // QaURL: "https://qunatumdpsapi-preuat.wipro.com/PUAT.ALLIED.DPS/",
      QaURL: SOSBaseURL+"DEV.ALLIED.DPS/",
      QaURL4: SOSBaseURL+"L2O.Sprint4.Api/",
      genaralFileUpLoad:SOSBaseURL+"L2O.Common.Services.Api/api/v1/StorageCommon/UploadDocument_V_1",
      uploaddoc: SOSBaseURL+"L2O_3.5/L2O.Sprint1_2.Api/api/Storage/UploadDocument"
    },
    window.__env.wittyParrotIframe=  "https://mock-tokenhandler.azurewebsites.net/QA/index.html",
    window.__env.daCommunicationUrl="http://localhost:4321",
    window.__env.whatfix = SOEBaseURL+"whatfix.com/embed/embed.nocache.js",//"https://l2ostorageaccuat.blob.core.windows.net/embed/embed.nocache.js"
// You can create other variable also based on your requirement.
  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.IsConsoleLog=true;
  window.__env.enableDebug = true;
  window.__env.encryptFlag=true;
  window.__env.enableCipher=true;
  window.__env.envName="DEV";
  window.__env.withCredentials=false;

  window.__env.encDecConfig={
    key: "DecryptionDecrip"
  },
  window.__env.ellaUrl= "https://ella.wipro.com/",
  window.__env.wittyBaseUrl = SOSBaseURL+"L2O.Sprint5A.Api/api/v5/",
  window.__env.Socket_PATH_URL= "/trace";

  window.__env.collaborationUrl = "https://qawittychat.wipro.com/chatapi/wittyparrot/api/wpchat/embed"
  window.__env.collaborationAppSecret = "da3068e9-e480-4a0c-aae4-00e0a9d014b9"
  window.__env.collaborationEnvironment = 'QA',
  window.__env.collaborationHostApplication = "L2O"
}(this));

