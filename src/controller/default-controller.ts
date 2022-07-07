import { controller, interfaces } from "inversify-express-utils";

@controller('/default')
export class DefaultController implements interfaces.Controller {

}