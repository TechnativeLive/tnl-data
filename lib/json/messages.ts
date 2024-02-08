import { IValidation } from 'typia';

export const formatValidationError = (error: IValidation.IError) => {
  return [`At path: ${error.path}`, `Expected: ${error.expected}`, `Received: ${error.value}`].join(
    '\n',
  );
};
