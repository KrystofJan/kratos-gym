// NOTE: Maybe don't really need this
export default abstract class BaseService {
    domain: string;
    path: string;

    constructor(domain: string, path: string) {
        this.domain = domain;
        this.path = path;
    }
}
