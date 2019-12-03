import { module2 } from '../../src/index';

describe('module2', function() {
    it('print', function() {
        var module = new module2('Hello World');
        expect(module.getMessage()).toMatchSnapshot();
    });
});