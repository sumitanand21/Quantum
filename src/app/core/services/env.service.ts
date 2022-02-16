export class EnvService {

    // The values that are defined here are the default values that can
    // be overridden by env.js
  
    // API url
    // We will use same variables which we are using in env.js
    public apiUrl = '';
    public clientIdAuthConfig = '';
    public clientIdOutlookConfig = '';
    public maintainence = '';
    public enableUsers = '';
    public daUrl = '';
    public daApiBaseUrl = '';
    public serverUrl = '';
    public outLookUrl  = '';
    public l2oBaseUrlOpportunityDecript = '';
    public l2oBaseUrlOpportunity = '';
    public toolkitUrl = '';
    public accountPlanUrl = '';
    public syncredirect = '';
    public l2oBaseUrlOrder = '';
    public l2oBaseUrl = '';
    public l3oBaseUrl = '';
    public l2oFileUploadBaseUrl = '';
    public camunda_BASE_URL = '';
    public camundaPorts = {
      create: "", // "4501",
        modif: "", //"9090",
        assign: "",
        reserve: "",
        reminder: '', // '4505',
        salesOrder: '',// '4503',
        IFandCO: '', //'4517',
        orderModification: '', //'4520'
    };
    public CommonBaseUrl = '';
    public outlookConfig= {
      instance: "",
      tenant: "",
      // clientId: "d37e5901-9e1f-4142-85e6-09abc618dae6",
      redirectUri: "",
      response_mode: "",
      postLogoutRedirectUri: "",
      endpoints: {
      },
      navigateToLoginRequestUrl: ''
    };

    public authConfig= {
      domainUrl: "",
      loginUrl: "",
      logoutUrl: "",
      redirectUrl: "", //'https://l2o-app.azurewebsites.net'
      //clientId: 'ef6d9135-e4d0-4e4b-acbb-fd81e5e45cf9',
      scope: "",
      resource: "",
      responseType: "",
      tokenEndpoint: "",
      requestAccessToken: '',
      grantType: "",
      // clientSecret: "3qFLLagz88665aM0iw6yWZUOjSywikHTWJKzoqke",
      // clientId: "05b31483-b5e6-40a8-98af-9ffff799ede7", //'21fad7f8-20fd-48fb-8f88-7bb306a9f8f4',
      key: "", //'3qFLLagz88665aM0iw6yWZUOjSywikHTWJKzoqke',
      url: ""
    };

    public sprint5BaseUrl = {
      // QaURL2: 'https://quapi-dev.wipro.com/L2O.Sprint1_2.Api/',
      QaURL5A: "",
      QaURL: "",
      QaURL4: "",
      genaralFileUpLoad:
        "",
      uploaddoc:
        ""
    };
    public wittyParrotIframe = "";
    public daCommunicationUrl = "";
    // Whether or not to enable debug mode
    public IsConsoleLog=false;
    public enableDebug = true;
    public encryptFlag=true;
    public enableCipher=true;
    public withCredentials=false;
    public envName="";
    public encDecConfig={
      key:""
    }
    public whatfix = "";
    public ellaUrl="";
    public wittyBaseUrl="";
    public Socket_PATH_URL="";
    public collaborationUrl = "";
    public collaborationAppSecret = "";
    public collaborationEnvironment = "";
    public collaborationHostApplication = "";
    constructor() {

    }
  
  }
  