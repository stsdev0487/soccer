import { 
    snakeToCamelCase,
    snakeToCamelCaseKeys,
    camelToSnakeCase,
    camelToSnakeCaseKeys,
} from './text';

test('snake_case to camelCase', () => {
    expect(camelToSnakeCase('abc')).toEqual('abc');
    expect(snakeToCamelCase('first_name')).toEqual('firstName');
    expect(snakeToCamelCase('First_name')).toEqual('FirstName');
    expect(snakeToCamelCase('my_first_name')).toEqual('myFirstName');
    expect(camelToSnakeCase('')).toEqual('');
});

test('camelCase to snake_case', () => {
    expect(camelToSnakeCase('abc')).toEqual('abc');
    expect(camelToSnakeCase('firstName')).toEqual('first_name');
    expect(camelToSnakeCase('myFirstName')).toEqual('my_first_name');
    expect(camelToSnakeCase('')).toEqual('');
});

test('camelCase to snake_case of object keys', () => {
    expect(camelToSnakeCaseKeys({
        firstName: 'bishal',
        lastName: 'timilsina'
    })).toEqual({
        first_name: 'bishal',
        last_name: 'timilsina'
    });

    expect(snakeToCamelCaseKeys({})).toEqual({});
    expect(snakeToCamelCaseKeys(null)).toBeNull();
    expect(snakeToCamelCaseKeys(undefined)).toBeUndefined();
});

test('snake_case to camelCase of object keys', () => {
    expect(snakeToCamelCaseKeys({
        first_name: 'bishal',
        last_name: 'timilsina'
    })).toEqual({
        firstName: 'bishal',
        lastName: 'timilsina'
    });

    expect(snakeToCamelCaseKeys({})).toEqual({});
    expect(snakeToCamelCaseKeys(null)).toBeNull();
    expect(snakeToCamelCaseKeys(undefined)).toBeUndefined();
});
