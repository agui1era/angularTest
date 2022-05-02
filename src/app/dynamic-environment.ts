import {environment} from "@environments/environment";

declare var window: any;

export class DynamicEnvironment {
  public get apiUrl() {
    //return "https://mesdev.igromi.com:9999"
    //return "https://mes.igromi.com:9999"
    //return "https://agrosuper.igromi.com:9999"
    return window.location.protocol+"//"+window.location.hostname + (environment.production ? ":9999":":3000");
  }
}
