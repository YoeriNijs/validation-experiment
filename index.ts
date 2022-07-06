interface IValidationError {
  type: string;
  message: string;
}

interface IValidationFunction {
  validate: (value: any) => IValidationError[];
}

interface IValidationFieldAndFunctions {
  fields: string[];
  functions: IValidationFunction[];
}
const executeValidationRule = (obj: any, validation: IValidationFieldAndFunctions): IValidationError[] => {
  return Object.keys(obj)
  .filter((actualField) => validation.fields.some((expectedField) => expectedField === actualField))
  .reduce((existingValidationErrors, actualField) => {
    const newValidationErrors = validation.functions.map((fn) => fn.validate(obj[actualField]));
    return existingValidationErrors.concat(newValidationErrors);
  }, []);
}

const validate = (
  obj: any,
  validations: IValidationFieldAndFunctions[]
): IValidationError[] => {
  return validations
  .map(validation => executeValidationRule(obj, validation))
  .reduce((prev, curr) => prev.concat(curr), [])
  .reduce((prev, curr) => prev.concat(curr), []);
};

export class NoBlankValidator implements IValidationFunction {
  validate(value: any): IValidationError[] {
    if (!value || value.length < 1) {
      return [{ type: 'blank', message: `Value '${value}' is blank!` }];
    } else {
      return [];
    }
  }
}

export class StringValidator implements IValidationFunction {
  validate(value: any): IValidationError[] {
    if (typeof value !== 'string') {
      return [{ type: 'type error', message: `Value '${value}' is no string!` }];
    } else {
      return [];
    }
  }
}

export class NumberValidator implements IValidationFunction {
  validate(value: any): IValidationError[] {
    if (typeof value !== 'number' || `${Number(value)}` === 'NaN') {
      return [{ type: 'type error', message: `Value '${value}' is no number!` }];
    } else {
      return [];
    }
  }
}

const noBlankValidator = () => new NoBlankValidator();
const stringValidator = () => new StringValidator();
const numberValidator = () => new NumberValidator();

const person = {
  name: 'Bert',
  age: 30,
};

const validationErrors = validate(person, [
  {
    fields: ['name'],
    functions: [noBlankValidator(), stringValidator()],
  },
  {
    fields: ['age'],
    functions: [noBlankValidator(), numberValidator()],
  }
]);

console.log(validationErrors);
