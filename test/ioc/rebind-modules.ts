import { Container } from "inversify";
import { IDS } from '../../src/types/index';
import { TestAxiosMock } from '../mock/test-axios-mock';

export function rebindModules(container: Container){
    container.bind(IDS.NODE_MODULES.axios).toConstantValue(TestAxiosMock)
}