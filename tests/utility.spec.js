import * as utility from '../src/utility';


describe('test utility', () => {
    it('should return true if input is valid', () => {
        const result = utility.isInputValid({username: 'aaa', age: 58, married: true}, false);

        expect(result).toEqual(true);
    });

    it('should return true if input is valid and update mode is set', () => {
        const result = utility.isInputValid({id: '1', username: 'aaa', age: 58, married: true}, true);

        expect(result).toEqual(true);
    });

    it('should return false if name is empty or null', () => {
        const result1 = utility.isInputValid({age: 58, married: true}, false);
        const result2 = utility.isInputValid({username: '', age: 58, married: true}, false);
        const result3 = utility.isInputValid({username: null, age: 58, married: true}, false);

        expect(false).toEqual(result1);
        expect(false).toEqual(result2);
        expect(false).toEqual(result3);
    });

    it('should return false if age is empty or null', () => {
        const result1 = utility.isInputValid({username: 'aaaa', age: '', married: true}, false);
        const result2 = utility.isInputValid({username: 'aaaa', age: null, married: true}, false);
        const result3 = utility.isInputValid({username: 'aaaa', married: true}, false);

        expect(false).toEqual(result1);
        expect(false).toEqual(result2);
        expect(false).toEqual(result3);
    });


    it('should return false if married is empty or null', () => {
        const result1 = utility.isInputValid({username: 'aaaa', age: 58, married: ''}, false);
        const result2 = utility.isInputValid({username: 'aaaa', age: 58, married: null}, false);
        const result3 = utility.isInputValid({username: 'aaaa', age: 58}, false);

        expect(false).toEqual(result1);
        expect(false).toEqual(result2);
        expect(false).toEqual(result3);

    });

    it('should return false if update mode  is set and if id is empty or null', () => {
        const result1 = utility.isInputValid({username: 'aaaa', age: 58, married: true}, true);
        const result2 = utility.isInputValid({id: null, username: 'aaaa', age: 58, married: true}, true);
        const result3 = utility.isInputValid({id: '', username: 'aaaa', age: 58, married: true}, true);

        expect(false).toEqual(result1);
        expect(false).toEqual(result2);
        expect(false).toEqual(result3);
    });
});
