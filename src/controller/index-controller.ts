import { controller, httpGet, interfaces, response } from "inversify-express-utils";
import { appleSiteJson } from '../enums/appleSite';

@controller('/')
class IndexController implements interfaces.Controller {

    @httpGet('/health-check')
    healthCheck(@response() res){
        res.json({ success: true });
    }

    @httpGet('/login*')
    login(@response() res){
        res.json(appleSiteJson)
    }

    @httpGet('/apple-app-site-association')
    appleSiteAssociation(@response() res){
        res.json(appleSiteJson);
    }
}