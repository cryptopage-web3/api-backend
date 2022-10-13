import { container } from '../../src/ioc';
import { rebindModules } from './rebind-modules';

export const testContainer = container.createChild()

rebindModules(testContainer)